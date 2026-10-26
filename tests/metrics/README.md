# Dashboard reporting regression checks

Run `npm run test:metrics` after installing the locked dependencies.

The checks exercise the actual calculation helper and metrics route with a
controlled tenant-scoped database adapter. They cover mixed original currencies,
BRL fallback only for BRL debts, integer-cent totals, overdue active cases,
empty portfolios, invalid/missing conversion data, UTC month/year boundaries,
future/missing payment dates, 1,201-row pagination, changing counts and failure of
the recent-debt query. No remote database or payment service is contacted.

Reporting uses stored BRL conversions, not settlement cash or live FX rates.
The API now returns `monthly_recovery` for twelve UTC months and BRL-only totals.
The invalid mixed-currency fields `total_em_aberto`, `recuperado_mes` and the
placeholder `variacao_mensal` were removed from this internal dashboard response.
Deploy the dashboard and this API together. Browser verification remains separate.

`npm run test:data-states` also checks the rendered BRL recovery amount, the
six/twelve-month selector and the disabled-communications message.
