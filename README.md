# Relay

A responsive outbound pipeline dashboard for the HubSpot → Clay → Lemlist workflow.

## Run

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). `npm run dev` enables server watch mode. `npm test` runs HTTP smoke tests.

## Current capabilities

- Demo pipeline, campaign metrics, illustrative AI analysis, and optimization recommendations.
- Campaign filtering, date range selection, campaign details, CSV export, and browser-local approval history.
- Approval dialog explains scope, estimated credit usage, and outreach effects. Demo approvals do not execute external actions.
- `/api/integrations` checks HubSpot contact read access and Lemlist campaign read access using server-side credentials. Provider errors are sanitized; credentials are never returned.

## Integrations

Set `HUBSPOT_ACCESS_TOKEN` and/or `LEMLIST_API_KEY` securely in the server environment, restart, and use Integrations → Check server connections. HubSpot requires contact read permission. Live provider access is optional for demo use.

The dashboard remains explicitly in demo mode even after a successful connection check. Live metric ingestion, campaign identifier mapping, historical period comparisons, generated AI analysis, durable user authentication/authorization and audit storage, and execution adapters remain to be implemented before production use. Clay needs a workspace-specific enrichment webhook adapter; `CLAY_WEBHOOK_URL` is a planned setting, not currently consumed. No credits are spent or outreach sent by this application.

For production, implement authenticated approval records with explicit scope, idempotency, expiry, and fresh provider-state verification before enabling external writes. Never expose provider secrets to the client.

## Deploy on Render

This repository includes `render.yaml` for a free Node web service. No provider credentials are needed for the demo.

1. Push this project to `ML-0802/hackathon-demo` on GitHub.
2. Open https://dashboard.render.com/select-repo?type=blueprint and connect the repository.
3. Review the `relay-outreach` service and deploy the Blueprint.
4. Open the service URL shown by Render after the deployment succeeds.

Render runs `npm ci --ignore-scripts`, starts `npm start`, sets `PORT`, and checks `/api/health`. Free services may sleep when idle. The actual URL is assigned by Render; do not assume a particular hostname before deployment.

Keep the public demo free of real CRM credentials until authentication and authorization are added. The current integration check endpoint is not authenticated.

## Free demo hosting on GitHub Pages

The `.github/workflows/pages.yml` workflow deploys only `public/`, never the server or credentials. In GitHub repository Settings → Pages, set the build source to **GitHub Actions**. Push to `main` or run the workflow manually to deploy. The expected project URL is https://ml-0802.github.io/hackathon-demo/ after a successful deployment.

GitHub Pages serves the interactive demo only. Connection checks and live integrations require the Node backend on another host. Never embed credentials in the static files.
