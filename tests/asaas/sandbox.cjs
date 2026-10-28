const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function harness(env = { ASAAS_ENVIRONMENT: 'sandbox', ASAAS_SANDBOX_API_KEY: 'fake-sandbox-key' }, responder) {
  const calls = [];
  let expire;
  let cleared = 0;
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('lib/asaas.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('module', 'exports', 'process', 'fetch', 'setTimeout', 'clearTimeout', code)(
    mod, mod.exports, { env }, async (url, options) => {
      calls.push({ url, options });
      return responder ? responder({ url, options, expire: () => expire() }) : { ok: true, json: async () => ({ id: 'pay_test' }) };
    }, (callback, delay) => { assert.equal(delay, 8000); expire = callback; return 1; }, () => { cleared++; });
  return { api: mod.exports, calls, cleared: () => cleared };
}

test('missing, production and malformed environment/key configurations never issue requests', async () => {
  for (const env of [{}, { ASAAS_ENVIRONMENT: 'production', ASAAS_SANDBOX_API_KEY: 'fake' },
    { ASAAS_ENVIRONMENT: 'sandbox', ASAAS_API_KEY: 'legacy-production-key' },
    { ASAAS_ENVIRONMENT: 'sandbox', ASAAS_SANDBOX_API_KEY: ' fake ' },
    { ASAAS_ENVIRONMENT: 'sandbox', ASAAS_SANDBOX_API_KEY: 'fake\nkey' }]) {
    const h = harness(env);
    await assert.rejects(h.api.getPaymentStatus('pay_test'));
    assert.equal(h.calls.length, 0);
  }
});

test('all payment helpers use sandbox with no redirect, no cache, auth and application headers', async () => {
  const h = harness();
  await h.api.getPaymentStatus('pay_test');
  await h.api.getPixQrCode('pay_test');
  await h.api.getBoletoInfo('pay_test');
  await h.api.createPayment({ customer: 'cus_fake', billingType: 'PIX', value: 10, dueDate: '2026-12-01', description: 'fixture' });
  assert.deepEqual(h.calls.map(c => c.url), [
    'https://api-sandbox.asaas.com/v3/payments/pay_test',
    'https://api-sandbox.asaas.com/v3/payments/pay_test/pixQrCode',
    'https://api-sandbox.asaas.com/v3/payments/pay_test/identificationField',
    'https://api-sandbox.asaas.com/v3/payments',
  ]);
  for (const { options } of h.calls) {
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.access_token, 'fake-sandbox-key');
    assert.match(options.headers['User-Agent'], /CrossCollect/);
    assert(options.signal instanceof AbortSignal);
  }
  assert.equal(h.calls[3].options.method, 'POST');
  assert.equal(JSON.parse(h.calls[3].options.body).value, 10);
  assert.equal(h.cleared(), 4);
});

test('customer search and create stay in sandbox and reuse an existing customer', async () => {
  for (const found of [true, false]) {
    const h = harness(undefined, ({ options }) => ({ ok: true, json: async () => options.method === 'GET' ? { data: found ? [{ id: 'cus_existing' }] : [] } : { id: 'cus_new' } }));
    const result = await h.api.createOrFindCustomer({ name: 'Fixture', cpfCnpj: '123.456.789-00', email: 'fixture@example.invalid' });
    assert.equal(result.id, found ? 'cus_existing' : 'cus_new');
    assert.equal(h.calls.length, found ? 1 : 2);
    assert.equal(h.calls[0].url, 'https://api-sandbox.asaas.com/v3/customers?cpfCnpj=12345678900');
    if (!found) assert.equal(h.calls[1].url, 'https://api-sandbox.asaas.com/v3/customers');
  }
});

test('payment identifiers cannot change the request path or inject a query', async () => {
  const h = harness();
  for (const id of ['../customers', 'pay_x?other=1', 'pay_x#frag', '', 'a'.repeat(101)]) {
    for (const method of ['getPaymentStatus', 'getPixQrCode', 'getBoletoInfo']) await assert.rejects(h.api[method](id));
  }
  assert.equal(h.calls.length, 0);
});

test('provider and network errors do not expose payloads or retry creation', async () => {
  for (const responder of [
    () => ({ ok: false, status: 400, json: () => { throw new Error('must not read private body'); } }),
    () => { throw new Error('private credential/customer data'); },
    () => ({ ok: true, json: () => { throw new Error('private invalid JSON'); } }),
  ]) {
    const h = harness(undefined, responder);
    await assert.rejects(h.api.createPayment({}), error => {
      assert.match(error.message, /^Asaas sandbox: (HTTP 400|falha na comunicação)$/);
      return true;
    });
    assert.equal(h.calls.length, 1);
    assert.equal(h.cleared(), 1);
  }
});

test('deadline aborts both a pending request and a pending response body', async () => {
  for (const duringBody of [false, true]) {
    const h = harness(undefined, ({ options, expire }) => {
      const abort = () => { expire(); assert.equal(options.signal.aborted, true); throw new Error('aborted'); };
      return duringBody ? { ok: true, json: abort } : abort();
    });
    await assert.rejects(h.api.getPaymentStatus('pay_test'), /tempo limite excedido/);
    assert.equal(h.cleared(), 1);
  }
});

test('public charge creation authenticates and remains disabled without calling provider or database', async () => {
  const code = ts.transpileModule(fs.readFileSync('app/api/asaas/criar-cobranca/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  for (const authenticated of [false, true]) {
    const mod = { exports: {} };
    const denied = { status: 401 };
    new Function('require', 'module', 'exports', code)((name) => {
      if (name === '@/lib/require-auth') return { requireAuth: async () => ({ error: authenticated ? null : denied }) };
      if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, status: options.status }) } };
      throw new Error('Disabled route must not import a provider/database client: ' + name);
    }, mod, mod.exports);
    const response = await mod.exports.POST({ json: () => { throw new Error('Do not read charge data'); } });
    assert.equal(response.status, authenticated ? 503 : 401);
    if (!authenticated) assert.equal(response, denied);
  }
});
