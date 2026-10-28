const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file, { authenticated = true } = {}) {
  const seen = [];
  const db = {
    from(table) {
      return {
        select() { return this; },
        eq(column, value) { seen.push({ table, column, value }); return this; },
        order() { return this; }, limit() { return this; },
        single: async () => ({ data: table === 'dividas' ? { id: 'debt-a' } : null, error: null }),
        maybeSingle: async () => ({ data: { id: 'debt-a' }, error: null }),
        then: resolve => resolve({ data: [], error: null }),
      };
    },
    rpc(name, args) { seen.push({ rpc: name, args }); return { single: async () => ({ data: { id: 'debt-a' }, error: null }) }; },
  };
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', code)((name) => {
    if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } };
    if (name === '@/lib/require-auth') return { requireAuth: async () => ({ user: authenticated ? { id: 'user-a' } : null, error: authenticated ? null : { status: 401 } }) };
    if (name === '@/lib/tenant') return { getOwnCredorId: async () => 'tenant-a' };
    if (name === '@/lib/supabase-server') return { createServerClient: () => db };
    if (name === '@/lib/supabase-admin') return { rowToDebt: debt => debt };
    throw new Error('Unexpected import: ' + name);
  }, mod, mod.exports);
  return { route: mod.exports, seen };
}

test('debt read awaits Next 15 route params and keeps its tenant filter', async () => {
  const { route, seen } = load('app/api/dividas/[id]/route.ts');
  const response = await route.GET({}, { params: Promise.resolve({ id: 'debt-a' }) });
  assert.equal(response.status, 200);
  assert(seen.some(x => x.table === 'dividas' && x.column === 'id' && x.value === 'debt-a'));
  assert(seen.some(x => x.column === 'credor_id' && x.value === 'tenant-a'));
  assert(seen.some(x => x.table === 'historico_acoes' && x.column === 'divida_id' && x.value === 'debt-a'));
});
test('debt update awaits route params before calling the atomic RPC', async () => {
  const { route, seen } = load('app/api/dividas/[id]/route.ts');
  const response = await route.PATCH({ json: async () => ({ nota: 'test note' }) }, { params: Promise.resolve({ id: 'debt-a' }) });
  assert.equal(response.status, 200);
  assert.deepEqual(seen, [{ rpc: 'update_debt_with_history', args: { p_divida_id: 'debt-a', p_status: null, p_nota: 'test note' } }]);
});
test('payment lookup awaits route params and checks ownership before reading payment data', async () => {
  const { route, seen } = load('app/api/dividas/[id]/pagamento/route.ts');
  const response = await route.GET({}, { params: Promise.resolve({ id: 'debt-a' }) });
  assert.equal(response.status, 200);
  assert.deepEqual(seen, [
    { table: 'dividas', column: 'id', value: 'debt-a' },
    { table: 'dividas', column: 'credor_id', value: 'tenant-a' },
    { table: 'pagamentos_asaas', column: 'divida_id', value: 'debt-a' },
  ]);
});
test('anonymous dynamic routes reject before resolving params or touching data', async () => {
  const params = { then() { throw new Error('Anonymous request must not resolve params'); } };
  for (const file of ['app/api/dividas/[id]/route.ts', 'app/api/dividas/[id]/pagamento/route.ts']) {
    const { route, seen } = load(file, { authenticated: false });
    for (const method of Object.values(route)) assert.equal((await method({}, { params })).status, 401);
    assert.equal(seen.length, 0);
  }
});
