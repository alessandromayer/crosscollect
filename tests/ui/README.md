# Data loading regression checks

Run `npm run test:data-states` after installing the locked development dependencies.

The tests render the actual dashboard and debt-list components with controlled
HTTP responses. They verify loading without a balance, handling of 401 and 403,
and recovery from a 500 response or network failure through the retry control.
Only a successful response with an empty portfolio may display a zero balance.

External exchange-rate components and navigation are isolated. This does not
replace the staging RLS tests or browser authentication verification. No emails,
credentials or external data sources are used.
