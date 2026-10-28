// Regression checks for HTTP failure -> retry -> valid data in the actual page components.
// No browser credentials, external requests or database writes are used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { create, act } = require('react-test-renderer');
const messages = require('../../messages/pt.json');
const root = path.resolve(__dirname, '../..');
const cache = new Map();

function load(relative) {
  const filename = path.join(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  function resolve(name) {
    if (name === 'next/link') return ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
    if (name === 'next-intl') return { useLocale: () => 'pt', useTranslations: (namespace) => (key, args = {}) => {
      let value = [namespace, ...key.split('.')].reduce((obj, part) => obj?.[part], messages) ?? key;
      for (const [name, replacement] of Object.entries(args)) value = value.replaceAll(`{${name}}`, String(replacement));
      return value;
    } };
    if (name === '@/hooks/use-cotacoes') return { useCotacoes: () => ({ cotacoes: null }), getBid: () => 1 };
    if (name === '@/components/cotacoes-panel') return { CotacoesPanel: () => null };
    if (name.startsWith('@/')) {
      const relative = name.slice(2);
      return load(relative + (fs.existsSync(path.join(root, relative + '.tsx')) ? '.tsx' : '.ts'));
    }
    return require(name);
  }
  new Function('require', 'module', 'exports', code)(resolve, module, module.exports);
  return module.exports;
}

const metrics = {
  total_em_aberto_brl: 0, recuperado_mes_brl: 0,
  taxa_sucesso: 0, casos_ativos: 0, casos_vencidos: 0,
  monthly_recovery: [{ month: "2026-01", total_brl: 0 }],
  portfolio: { pendente: 0, em_negociacao: 0, vencido: 0, pago: 0, total: 0 },
};
const text = (view) => JSON.stringify(view.toJSON());
const originalFetch = global.fetch;

async function checkPage(file, validPayload) {
  const Page = load(file).default;
  for (const status of [401, 403, 500, 0]) {
    const requests = [];
    global.fetch = (_url, options) => new Promise((resolve, reject) => {
      requests.push({ resolve, reject });
      options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    });
    let view;
    await act(async () => { view = create(React.createElement(Page)); });
    assert(text(view).includes(messages.dataState.loading));
    assert(!text(view).includes('R$'), 'Loading must not display a zero balance');
    await act(async () => { const pending = requests.shift();
      if (status === 0) pending.reject(new Error('offline'));
      else pending.resolve({ ok: false, status, json: async () => ({ error: 'fixture' }) }); });
    const expected = status === 401 ? messages.dataState.sessionExpired
      : status === 403 ? messages.dataState.activationPending : messages.dataState.errorTitle;
    assert(text(view).includes(expected), `Expected status-specific message for ${status}`);
    assert(!text(view).includes('R$'), 'Failed requests must not display a zero balance');
    if (status === 401) assert.equal(view.root.findByType('a').props.href, '/login');
    if (status === 403) assert.equal(view.root.findAllByType('button').length, 0);
    if (status === 500 || status === 0) {
      await act(async () => { view.root.findByType('button').props.onClick(); });
      assert(text(view).includes(messages.dataState.loading));
      await act(async () => { requests.shift().resolve({ ok: true, status: 200, json: async () => validPayload }); });
      assert(!text(view).includes(messages.dataState.errorTitle));
      assert(!text(view).includes(messages.dataState.loading));
      assert(text(view).includes('R$'), 'A valid empty portfolio may display a real zero balance');
      assert(!text(view).includes('+8.2%') && !text(view).includes('+3.1%'));
    }
    await act(async () => view.unmount());
    console.log('PASS', file, status, status === 500 || status === 0 ? 'and retry with valid empty data' : 'without false empty state');
  }
}

(async () => {
  try {
    await checkPage('app/(dashboard)/dashboard/page.tsx', { metrics, recentDebts: [] });
    await checkPage('app/(dashboard)/dividas/page.tsx', []);
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.UTC(2025, 10 + i, 1)).toISOString().slice(0, 7), total_brl: i + 1,
    }));
    const actual = { ...metrics, total_em_aberto_brl: 1125, recuperado_mes_brl: 600.5, monthly_recovery: monthly };
    global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ metrics: actual, recentDebts: [] }) });
    const Dashboard = load('app/(dashboard)/dashboard/page.tsx').default;
    let view;
    await act(async () => { view = create(React.createElement(Dashboard)); });
    const firstLabel = new Intl.DateTimeFormat('pt', { month: 'short', year: '2-digit', timeZone: 'UTC' })
      .format(new Date(monthly[0].month + '-01T00:00:00Z'));
    assert(!text(view).includes(firstLabel), 'Default chart should show only the last six months');
    await act(async () => view.root.findByType('select').props.onChange({ target: { value: '12' } }));
    assert(text(view).includes(firstLabel), 'Twelve-month selection must show the earlier payment month');
    assert(text(view).includes(load('lib/utils.ts').formatCurrency(600.5)), 'Recovery card must show its BRL amount');
    assert(!text(view).includes('NaN'));
    assert(text(view).includes(messages.dashboard.communications.disabled));
    await act(async () => view.unmount());
    console.log('PASS dashboard stored BRL values, real 6/12-month selection and disabled communications');
  } finally { global.fetch = originalFetch; }
})().catch((error) => { console.error(error); process.exitCode = 1; });
