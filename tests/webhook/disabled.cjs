const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('app/api/asaas/webhook/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', code)((name) => name === 'next/server' ? { NextResponse: { json: (body, options) => ({ body, status: options.status }) } } : require(name), mod, mod.exports);
const request = token => ({ headers: { get: () => token }, json: () => { throw new Error('body must not be processed'); } });
test('payment webhook denies missing, incorrect and different UTF-8 byte-length tokens', async () => {
  process.env.ASAAS_WEBHOOK_AUTH_TOKEN = 'ab';
  for (const token of [null, 'no', 'éa']) assert.equal((await mod.exports.POST(request(token))).status, 401);
  delete process.env.ASAAS_WEBHOOK_AUTH_TOKEN;
  assert.equal((await mod.exports.POST(request('ab'))).status, 401);
});
test('valid token never acknowledges or processes a payment while integration is disabled', async () => {
  process.env.ASAAS_WEBHOOK_AUTH_TOKEN = 'test-token';
  assert.equal((await mod.exports.POST(request('test-token'))).status, 503);
  delete process.env.ASAAS_WEBHOOK_AUTH_TOKEN;
});
