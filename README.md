# Job Search Pulse

A complete, portable dashboard for your global job-search survey. It connects to the **private Google Sheet linked to your Google Form**, computes summaries on the server, and refreshes the public website automatically.

**Included:** responsive dashboard; country, industry, experience and search-status views; reply and invitation bands; ghosting; hiring-stage distributions; application channels and volume; respondent demographics; weekly participation; accessible data tables; aggregate CSV export; demo mode; small-group suppression; Vercel and Netlify adapters; the original Google Form builder.

**Status:** ready-to-deploy source. It is not connected to your Google account or deployed to a public URL. Demo mode uses clearly labelled synthetic data. Switching to live mode requires the Google setup below.

## 1. Preview locally

Install **Node.js 22.9+ (22 LTS)**, unzip the project and open a terminal in `job-search-pulse`.

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. There are no application dependencies; `npm install` simply checks the lockfile. The default is demo mode with 1,840 synthetic responses. Demo numbers are not research findings. The backend is required even in demo mode: opening `index.html` directly is not supported.

```sh
npm test
npm run build
```

The build copies only `public/` into `dist/`. Credentials and backend code are not copied into the public site. The hosting provider packages its server function separately.

## 2. Create or link the Google Form

If you have not created the survey yet:

1. Open [Google Apps Script](https://script.google.com/) in the account that will own the survey and create a new project.
2. Paste **`integration/create-job-search-form.gs`** into `Code.gs`.
3. Run **`createJobSearchSurvey`** and review Google's permission request. This creates the Form and response Sheet in your account.
4. Open the edit and Sheet URLs printed in the execution log. Review the unpublished form, publish it for the intended respondents and test the responder URL in a signed-out browser.
5. Keep the response Sheet **private**. Do not use “Publish to web.”

The builder creates the survey described in `integration/survey-specification.md`. The dashboard matches its exact question titles in `server/schema.js`. The builder's Data dictionary tab is useful for checking field IDs, but the dashboard does not need to read it.

If you already ran the supplied builder, use that existing response Sheet; do not create a duplicate survey. For a manually constructed or renamed form, see **Schema changes** below.

## 3. Give the server read-only access to the response Sheet

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API** in that project.
3. Under **IAM & Admin → Service Accounts**, create a service account for this dashboard. It does not need a project-wide role or domain-wide delegation for this task.
4. Create a JSON key for the service account. Keep it private. If your organization's policy prevents key creation or sharing, ask its administrator for an approved approach; do not weaken that policy.
5. Open your response Sheet → Share. Add the service account's `client_email` as a **Viewer**. Leave general access restricted. Share only this Sheet with the service account.
6. Record the Sheet ID: in `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, copy only `SHEET_ID`.
7. Record the exact response-tab name, often **Form Responses 1**. The document title and tab name are different.

The server signs a short-lived JWT using the service-account key, exchanges it for an access token, and calls Google Sheets with the `spreadsheets.readonly` scope. It fetches headers, then only the timestamp and fixed-choice columns on an explicit allowlist. It never fetches free-text feedback, names, emails, or detailed state/province answers. It never writes to the Sheet.

## 4. Configure environment variables

For local live testing, copy `.env.example` to `.env`. On Vercel or Netlify, add the same values in the project's **server environment variables**, never in browser JavaScript.

| Variable | Value |
|---|---|
| `DATA_MODE` | `live` for real responses; `demo` for a labelled preview |
| `GOOGLE_SHEET_ID` | ID of the private response spreadsheet |
| `GOOGLE_RESPONSE_TAB` | Exact tab name, e.g. `Form Responses 1` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the service-account JSON |
| `GOOGLE_PRIVATE_KEY` | The JSON file's `private_key` value, including BEGIN/END lines; actual newlines or literal `\n` are both accepted |
| `SURVEY_FORM_URL` | Public respondent URL from Google Forms (`https://docs.google.com/...` or `https://forms.gle/...`) |
| `SURVEY_ROUND_START` | Optional `YYYY-MM-DD`; only include submissions from this calendar date onward |
| `MIN_GROUP_SIZE` | Default `20`; supported range 10–1000 |
| `CACHE_SECONDS` | Default `120`; supported range 60–3600 |
| `HEADER_OVERRIDES_JSON` | Optional JSON mapping stable field IDs to your exact edited question titles |

Do not prefix secrets with `PUBLIC_`, `VITE_`, or `NEXT_PUBLIC_`. Do not commit `.env`, a downloaded service-account JSON or screenshots containing credentials. Restart locally or redeploy after configuration changes.

**Live mode fails closed:** a missing credential, unshared Sheet, unexpected header or failed Google call produces an unavailable state. It never silently replaces live results with demo numbers. With fewer than the minimum number of eligible responses, an honest “more participation needed” state appears.

## 5A. Deploy to Netlify

1. Push the project folder to a Git repository. Make `package.json` the repository root, or set the base directory to the containing project folder.
2. In Netlify, import the repository.
3. The included `netlify.toml` sets build command **`npm run build`**, publish directory **`dist`**, Node **22** and functions directory **`netlify/functions`**.
4. Add the environment variables in Netlify with **Functions/runtime** availability. For a first preview use `DATA_MODE=demo`; for your real dashboard use `DATA_MODE=live` and the Google settings.
5. Deploy. The included function serves **`/api/dashboard`**; no rewrite is required because the function exports this path.
6. Open the site. Confirm “Live responses” after connecting, or “Demo data” before connecting. Submit a clearly identified test entry, check the result after the cache interval, then remove the test from both the Form and Sheet before collecting real data.

**Do not use a static drag-and-drop-only upload** for this project. A Git-based build or a Netlify CLI deployment that packages functions is required.

## 5B. Deploy to Vercel

1. Push the project to a Git repository and import it in Vercel.
2. Select **Other** as the framework preset. Set the root directory to this project.
3. The included `vercel.json` sets **`npm run build`** and output directory **`dist`**. Keep Node.js **22.x**.
4. Add the environment variables to the deployment environment. Keep production credentials out of untrusted preview deployments.
5. Deploy. Vercel discovers **`api/dashboard.js`** as the server function.
6. Confirm `/api/dashboard` returns an aggregate snapshot and that the site has the expected demo/live label.

**Hosting choice:** Vercel's Hobby plan is for personal, non-commercial use. Your planned company-review business may need a different plan. Netlify's Free plan has usage credits and can pause when its limit is reached. Neither provider is an unlimited free backend. Check the linked current policies before launching; code compatibility is not a promise of plan eligibility or unlimited capacity.

Official references checked while preparing this project:

- [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel Hobby policy](https://vercel.com/docs/plans/hobby)
- [Netlify functions](https://docs.netlify.com/build/functions/get-started/)
- [Netlify Free pricing](https://www.netlify.com/pricing/)
- [Google service-account credentials](https://developers.google.com/workspace/guides/create-credentials)
- [Google server-to-server authentication](https://developers.google.com/identity/protocols/oauth2/service-account)
- [Sheets batchGet](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGet)

## How the connection works

Google Forms saves answers to the private response Sheet. The read-only server function turns those answers into public aggregate summaries, which the dashboard displays.

The browser polls while the tab is visible. Server instances cache summaries for 120 seconds by default; CDN caching adds up to 60 seconds. Expect **roughly 1–3 minutes** in ordinary use, not an instant push after every submission. Manual Refresh asks for the latest available cached summary; it does not bypass server caching. No scheduled tasks or paid database are required. Warm-instance caching is not shared across all serverless instances, so a traffic spike can increase Google reads.

Only one dimension can be selected at a time: country of residence, target industry, experience or search status. Arbitrary cross-filters and per-person queries are intentionally unsupported. The site displays the snapshot time and retains the last good view, clearly marked unavailable, if an update fails.

## What the charts mean

- **Few or no replies:** share of eligible respondents selecting “None” or “Almost none / very few.” It is not the percentage of all applications rejected.
- **Communication stopped:** share of eligible respondents reporting this in any frequency band other than “Never.” The survey specifies the waiting-time definition.
- **Finding suitable roles is hard:** share selecting “Somewhat difficult” or “Very difficult.”
- **Reply and invitation bands:** ordinal answers, displayed separately. They are not averaged into exact conversion rates.
- **Hiring stages:** each respondent's furthest stage in the last 30 days; not an application funnel.
- **Channels:** multi-select use, not measured platform effectiveness.
- **Weekly participation:** submission counts by week, not a trend in job-market conditions. The current week is incomplete.

All chart denominators exclude unknown, missing and not-applicable values. A chart may have fewer eligible respondents than the selected cohort. Read the website's **About the data** tab and `DATA-POLICY.md` before interpreting results.

## Schema changes

Keep the original response question titles stable. Column order may change; matching is by exact header, not column position. The first response column must remain the Google Forms timestamp.

If you rename a question, either update its title in `server/schema.js` or set an override, for example:

```json
{"experience":"Your total years of work experience"}
```

Choice labels are also exact. If you change them, update the corresponding `options` array and any relevant metric conditions in `server/aggregate.js`, then run tests. Do not map a free-text field to an enumerated field. Duplicate or missing required headers cause `SCHEMA_MISMATCH` instead of silently corrupting the analysis. A translated form needs explicit mappings and option translations.

The response sheet should contain one survey round. `SURVEY_ROUND_START` can exclude pilot responses or a prior round by date, but it does not de-duplicate people. For recurring surveys, use clear round boundaries and one response per person per round. Do not combine revised questionnaires without versioning their definitions.

## Operational limits and troubleshooting

- **SOURCE_UNAVAILABLE:** check the server log's fixed error code. User-facing errors intentionally omit credentials and raw upstream details.
- **MISSING_GOOGLE_CONFIGURATION:** fill in all three Google credential/Sheet values and set the exact tab name.
- **INVALID_PRIVATE_KEY / GOOGLE_AUTH_FAILED:** verify the `private_key` and `client_email` came from the same active key and service account.
- **SHEET_ACCESS_DENIED:** enable the Sheets API and share the specific Sheet with the service account as Viewer.
- **SHEET_READ_FAILED:** check the spreadsheet ID, tab name, Google quota and account access.
- **SCHEMA_MISMATCH:** check the fixed question headers; use the override mechanism above. Do not point at the Data dictionary tab.
- **Empty dashboard with successful API:** fewer than the publication threshold, consent declined, incorrect timestamps, or an unsuitable round start may explain it.
- **Small subgroup charts mostly withheld:** expected when there is too little eligible data. Recruit more responses instead of lowering the threshold merely to reveal a small group.
- **Timestamp handling:** Google serial dates avoid locale-format parsing. Weekly buckets use the response Sheet's calendar dates; the dashboard does not infer the respondent's time zone.
- **Growth:** this starter reads allowlisted columns and rebuilds in-memory aggregates. It rejects datasets above 100,000 rows, but server memory/time or Google quotas may become limiting earlier. For a large viral launch, move ingestion to a database or scheduled aggregate publisher with a shared cache. The free hosting configuration is a starting point, not a high-traffic guarantee.

## Files

| Path | Purpose |
|---|---|
| `public/` | Complete responsive frontend, CSS, favicon and chart rendering |
| `server/google.js` | Read-only service-account connection; allowlisted column reads |
| `server/schema.js` | Original survey headers and permitted answer choices |
| `server/aggregate.js` | Normalization, cohort logic, KPIs and suppression |
| `server/endpoint.js` | Shared JSON endpoint, cache and validation |
| `server/demo.js` | Deterministic synthetic example responses |
| `api/dashboard.js` | Vercel adapter |
| `netlify/functions/dashboard.mjs` | Netlify adapter |
| `integration/` | Google Form builder and survey specification |
| `test/` | Tests for calculations, boundaries, privacy and failure modes |

## Validation and next step

The project includes automated tests and has been built locally. The local HTTP endpoint and deployment adapters were smoke-tested. A headless browser was unavailable and the cloud browser could not reach the local preview, so visual responsive-layout QA remains unverified. Google account authentication and a deployed provider runtime also still need an end-to-end check with your own credentials. Do not infer that a live account connection has already been tested.

To go live: deploy the demo, connect the private Sheet, switch `DATA_MODE` to `live`, validate with pilot responses, remove those tests, and then distribute the respondent link. The future company-review platform is a separate product; this dashboard publishes no company reviews or rankings.
