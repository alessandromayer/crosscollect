# Debt write security regression test

Run against a disposable Supabase/PostgreSQL database with all proposed migrations
applied, using an administrative test connection:

```sh
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f tests/security/debt-update.sql
```

Never run against production. The script uses fictional tenants and a failure
injection trigger inside a transaction, then rolls everything back. It checks:

- Both tenant A and tenant B can read only their own debts; cross-tenant RPC and history writes are denied.
- A user without a linked company sees no debts; the anonymous role cannot read debts or execute the update RPC.
- New debts have exactly one creation event. Direct status updates also produce an audit event.
- The API RPC and direct table writes reject unverified payments and reopening paid debts.
- Clients cannot change financial amounts, payment timestamps, or creditor ownership.
- Notes can still be added to paid debts.
- An audit failure rolls back debt creation, direct status updates, and RPC status/note changes.

Functions and triggers use invoker permissions and retain RLS. Column grants limit
clients to administrative status changes after creation. The privileged payment
webhook remains a separate flow and has not been certified by these tests.

The creation API relies on the database audit trigger. Apply the new migration
before deploying this API version. Production rollout requires a separate review.
These SQL checks do not certify browser login/cookies or HTTP authentication.
