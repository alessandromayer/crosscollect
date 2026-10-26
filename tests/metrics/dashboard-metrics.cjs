const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
function load(relative, resolve = require) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'module', 'exports', code)(resolve, module, module.exports);
  return module.exports;
}
const { calculateDashboardMetrics } = load('lib/dashboard-metrics.ts');
const now = new Date('2026-01-15T12:00:00Z');
const row = (changes = {}) => ({ id: '1', status: 'pendente', moeda: 'USD', valor: '100.00', valor_brl: '500.00', pago_em: null, ...changes });

test('mixed-currency totals use stored BRL conversions, including overdue active cases', () => {
  const m = calculateDashboardMetrics([
    row(), row({ id: '2', moeda: 'EUR', valor_brl: '600.00', status: 'vencido' }),
    row({ id: '3', moeda: 'BRL', valor: '25.00', valor_brl: null }),
    row({ id: '4', status: 'cancelado' }),
  ], now);
  assert.equal(m.total_em_aberto_brl, 1125);
  assert.equal(m.casos_ativos, 3);
  assert.equal(m.casos_vencidos, 1);
  assert(!('total_em_aberto' in m), 'Do not expose a mixed-currency sum');
});

test('real payment dates determine 12 UTC month buckets across the year boundary', () => {
  const m = calculateDashboardMetrics([
    row({ status: 'pago', pago_em: '2025-12-10T12:00:00Z' }),
    row({ id: '2', status: 'pago', moeda: 'EUR', valor_brl: '600', pago_em: '2025-12-31T23:30:00-03:00' }),
    row({ id: '3', status: 'pago', pago_em: '2024-12-01T00:00:00Z' }),
  ], now);
  assert.equal(m.monthly_recovery.length, 12);
  assert.equal(m.monthly_recovery[0].month, '2025-02');
  assert.deepEqual(m.monthly_recovery.slice(-2), [
    { month: '2025-12', total_brl: 500 }, { month: '2026-01', total_brl: 600 },
  ]);
  assert.equal(m.recuperado_mes_brl, 600);
  assert.equal(m.taxa_sucesso, 100);
});

test('empty portfolios and zero months are actual zero values; cents add exactly', () => {
  assert.equal(calculateDashboardMetrics([], now).taxa_sucesso, 0);
  assert(calculateDashboardMetrics([], now).monthly_recovery.every(m => m.total_brl === 0));
  assert.equal(calculateDashboardMetrics([row({ valor_brl: '0.10' }), row({ valor_brl: '0.20' })], now).total_em_aberto_brl, 0.3);
});

test('missing FX amounts, corrupt amounts and invalid payment dates fail instead of understating totals', () => {
  for (const bad of [row({ valor_brl: null }), row({ valor_brl: 'NaN' }), row({ valor_brl: '-1' }),
    row({ status: 'pago', pago_em: null }), row({ status: 'pago', pago_em: 'invalid' }),
    row({ status: 'pago', pago_em: '2026-01-20T00:00:00Z' })]) {
    assert.throws(() => calculateDashboardMetrics([bad], now));
  }
});

function routeHarness({ rows, changeCount = false, recentFailure = false }) {
  const calls = [];
  const db = { from: () => {
    let tenant;
    return {
      select() { return this; },
      eq(field, id) { assert.equal(field, 'credor_id'); tenant = id; return this; },
      order() { return this; },
      async range(start, end) {
        assert.equal(tenant, 'tenant-a'); calls.push([start, end]);
        return { data: rows.slice(start, end + 1), count: rows.length + (changeCount && start ? 1 : 0), error: null };
      },
      async limit() { assert.equal(tenant, 'tenant-a'); return { data: [], error: recentFailure ? new Error('fixture recent failure') : null }; },
    };
  } };
  const route = load('app/api/dashboard/metrics/route.ts', (name) => {
    if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } };
    if (name === '@/lib/supabase-server') return { createServerClient: () => db };
    if (name === '@/lib/require-auth') return { requireAuth: async () => ({ user: { id: 'user-a' }, error: null }) };
    if (name === '@/lib/tenant') return { getOwnCredorId: async () => 'tenant-a' };
    if (name === '@/lib/dashboard-metrics') return { calculateDashboardMetrics };
    throw new Error('Unexpected dependency: ' + name);
  });
  return { route, calls };
}

test('route reads every tenant page instead of truncating at the API row limit', async () => {
  const rows = Array.from({ length: 1201 }, (_, i) => row({ id: String(i) }));
  const { route, calls } = routeHarness({ rows });
  const response = await route.GET();
  assert.equal(response.status, 200);
  assert.equal(response.body.totalDebts, 1201);
  assert.equal(response.body.metrics.total_em_aberto_brl, 600500);
  assert.deepEqual(calls, [[0, 499], [500, 999], [1000, 1499]]);
});

test('route rejects changing counts and a failed recent-debt query instead of returning partial totals', async () => {
  const original = console.error;
  console.error = () => {};
  try {
    const rows = Array.from({ length: 501 }, (_, i) => row({ id: String(i) }));
    assert.equal((await routeHarness({ rows, changeCount: true }).route.GET()).status, 500);
    assert.equal((await routeHarness({ rows: [], recentFailure: true }).route.GET()).status, 500);
  } finally { console.error = original; }
});
