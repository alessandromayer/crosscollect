# Debt update regression test

Run against a disposable Supabase/PostgreSQL database with migrations `001` and
`002` applied, using an administrative test connection:

```sh
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f tests/security/debt-update.sql
```

Never run against production. The script uses fictional tenants and a failure
injection trigger inside a transaction, then rolls everything back. It checks:

- Tenant A cannot read tenant B's debts, update them through the RPC, or add history.
- A status update and note create both audit events.
- Unverified payments and reopening paid debts are rejected by the RPC.
- Notes can still be added to paid debts.
- An audit insert failure rolls back the status and all events in the RPC.
- The anonymous role cannot execute the RPC.

The RPC uses invoker permissions and requires the proposed history INSERT policy.
The API returns 503 if the RPC is absent. Migration 002 is a reviewed proposal,
not an automatically applied production change. These checks do not certify the
live database, browser login/cookie behavior, or permissions on direct table writes.
