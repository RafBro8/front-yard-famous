# Front Yard Famous

Modern booking and showcase website for Front Yard Famous, a yard greeting and celebration display business.

## Stage

Current stage: **Stage 8 production launch prep**

The current milestone is production-readiness for metadata, social previews, favicon assets, direct-route refreshes, service-area copy, and deployment planning.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Local Development

From Windows PowerShell:

```bash
npm run dev
```

Keep npm commands for this repo in one environment. If you are using Windows,
run install, dev, build, lint, and test from Windows PowerShell so native
optional dependencies like Rollup match the operating system.

Run the local API in a second terminal:

```bash
npm run dev:api
```

Build check:

```bash
npm run build
```

Lint check:

```bash
npm run lint
```

Full quality check:

```bash
npm test
```

API test check:

```bash
npm run test:api
```

Admin preview:

```bash
npm run dev
# open http://localhost:5173/admin
```

Public routes:

- `/`
- `/occasions`
- `/gallery`
- `/pricing`
- `/booking`
- `/faq`
- `/admin`

API checks:

```bash
curl http://127.0.0.1:4000/api/health
curl http://127.0.0.1:4000/api/bookings
```

## Environment

Copy `.env.example` to `.env` when you want local API configuration:

```powershell
Copy-Item .env.example .env
```

Default local booking requests are stored in `.data/booking-requests.json`, which is ignored by Git.

## Product Direction

Front Yard Famous should feel modern, joyful, polished, and uncluttered. The website should avoid the crammed one-page style common in local yard sign businesses and instead make booking, pricing, gallery browsing, and occasion discovery easy to scan.

## Data Model Direction

The current site content lives in typed frontend data files:

- `src/types/business.ts` defines business-facing TypeScript models.
- `src/data/siteContent.ts` stores occasions, packages, add-ons, inventory examples, availability rules, FAQs, and booking defaults.

These frontend models are intentionally shaped so they can later map to MongoDB documents or API responses without redesigning the whole site.

## Admin Direction

Stage 5 adds a separate `/admin` view with mock booking requests, statuses, inventory priorities, package controls, and blackout dates. It is intentionally frontend-only so the user-facing site can stay polished while the operational workflow is designed before backend and authentication decisions.

## API Direction

Stage 6 adds a built-in Node HTTP API with these starter endpoints:

- `GET /api/health`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/inventory`

The current persistence layer uses local JSON so the booking workflow can be tested immediately. Mongo Atlas remains the intended production persistence option once backend dependencies and deployment details are added.

## Testing Direction

Stage 7 uses Node's built-in test runner so the project gets useful coverage without adding new packages during the local environment transition.

Current coverage:

- Booking payload validation.
- API health metadata.
- Booking request validation failures.
- Malformed JSON handling.
- Booking creation and listing.
- Starter inventory/package endpoint.

Later quality pass:

- Add Vitest and React Testing Library for component tests.
- Add Playwright for browser smoke tests across `/`, `/admin`, and booking submission.
- Add CI once the deployment path is chosen.

## Public Site Direction

Stage 7.5 keeps the homepage light and moves deeper customer content into focused routes. This avoids the crowded single-page feel while keeping navigation simple and familiar.

## Launch Direction

Stage 8 adds route-specific metadata, social preview tags, favicon/manifest files, robots and sitemap files, and a Vercel rewrite so direct refreshes on public routes work in production. The sitemap and social URLs currently use `https://fyf.com` as the planned production domain placeholder.

Launch checklist:

- `docs/deployment-checklist.md`

## Version 1 Recommendation

- Public website first.
- Booking inquiry flow, not instant checkout.
- Manual availability confirmation.
- Admin login only when booking/inventory management becomes useful.
- No customer login until repeat bookings, payment history, or customer self-service justify it.
