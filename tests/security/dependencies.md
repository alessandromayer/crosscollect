# Dependency security update (2026-10-28)

The draft branch moves Next.js and eslint-config-next from 14.2.5 to 15.5.28, retains React 18.3.1, and awaits promised parameters in the debt read/update/payment routes. `test:routes` checks those parameters, tenant filtering and anonymous rejection.

Next.js 14 is outside support. Next.js 15 remains in Maintenance LTS per the current support policy. Version 15.5.28 includes the October security fixes. This update does not migrate to Next.js 16 or React 19.

Updated compatible indirect packages through npm, plus pinned next-intl 4.14.9, Resend 6.35.0 and PostCSS 8.5.32. A scoped npm override makes Next.js use the same PostCSS version as the direct dependency (`$postcss`), replacing its vulnerable pinned 8.4.31 dependency. Revisit the override when upgrading Next.js. The regenerated lockfile was verified with a clean `npm ci`.

Validation:
- `npm audit --json`: package findings went from 25 (1 critical, 15 high, 8 moderate, 1 low) to 0, including development dependencies. This is a dated registry check, not proof that the application has no vulnerabilities.
- Clean `npm ci`, TypeScript, `git diff --check` and production build passed.
- 28 automated scenarios passed: 9 payment safeguards, 6 dashboard metrics/API, 9 UI data states and 4 asynchronous route/security scenarios.
- Local production HTTP checks passed for login/cadastro (200), anonymous dashboard (307), anonymous debt list/create/detail/update/payment lookup and metrics (401), anonymous Asaas creation/webhook (401): 11 requests total. The local server used an explicit loopback hostname because interface enumeration is restricted in this environment.
- Authenticated browser login, session refresh/navigation and logout remain pending. Earlier authenticated HTTP evidence predates this dependency update and is not a full regression validation of this version.

Known limitations:
- Deprecated Supabase auth helpers remain on 0.10.0. Next.js 15 permits the legacy synchronous cookie API used by that adapter; migrate to @supabase/ssr before removing that compatibility or upgrading to Next.js 16.
- npm still reports deprecation notices for legacy tooling (including ESLint 8). Deprecation and vulnerability findings are different checks.
- Real email, WhatsApp, charges and webhook processing remain disabled. No provider credentials or user records were created during this update.
- Changes are in the draft branch/preview. Production main is not upgraded by this PR.

Primary references checked:
- https://nextjs.org/support-policy
- https://nextjs.org/docs/app/guides/upgrading/version-15
- https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r
- https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/postcss/postcss/security/advisories/GHSA-r28c-9q8g-f849
- https://github.com/postcss/postcss/releases/tag/8.5.32
