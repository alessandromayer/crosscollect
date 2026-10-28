# Asaas sandbox transport

Run `npm run test:payments`. Requests and deadlines are controlled test doubles; no API keys, customer accounts, real payments or network calls are used.

The server client requires `ASAAS_ENVIRONMENT=sandbox` and a separate `ASAAS_SANDBOX_API_KEY`. It never reads the former `ASAAS_API_KEY`, and production transport is unavailable. API keys must be stored exactly as issued, without quote/backslash repair. The fixed sandbox origin, redirect rejection, noncached responses, application header, eight-second deadline, payment identifier validation and redacted errors are covered by tests. Creation requests are not retried automatically because an ambiguous failure may already have created a charge.

The public creation route still returns 503 after user authentication. The webhook still returns 401 for invalid authentication or 503 for valid authentication; it does not acknowledge or store an event. Existing webhook queues can pause after repeated failed deliveries. This is a temporary pilot safeguard, not a production-ready payment integration.

Before activation: persist incoming events with a unique event ID, verify the provider payment and its customer/value/reference against the local charge, reconcile atomically with an audit record, test replay/concurrency/out-of-order events, and complete an actual sandbox journey. No Asaas sandbox account or credentials have been configured or exercised by this test suite.

Official references checked 2026-10-28:
- https://docs.asaas.com/reference/about-this-doc
- https://docs.asaas.com/docs/authentication-2
- https://docs.asaas.com/docs/webhooks-faq
- https://docs.asaas.com/docs/receive-asaas-events-at-your-webhook-endpoint
