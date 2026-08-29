# Front Yard Famous

Modern booking and showcase website for Front Yard Famous, a yard greeting and celebration display business.

## Stage

Current stage: **Stage 6 backend and persistence foundation**

The current milestone is a lightweight Node API for booking requests, local durable JSON storage for development, and frontend form submission through `/api/bookings` before adding real auth, Mongo Atlas, payments, or customer accounts.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Local Development

From Ubuntu/WSL:

```bash
npm install
npm run dev
```

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

Admin preview:

```bash
npm run dev
# open http://localhost:5173/admin
```

API checks:

```bash
curl http://127.0.0.1:4000/api/health
curl http://127.0.0.1:4000/api/bookings
```

## Environment

Copy `.env.example` to `.env` when you want local API configuration:

```bash
cp .env.example .env
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

## Version 1 Recommendation

- Public website first.
- Booking inquiry flow, not instant checkout.
- Manual availability confirmation.
- Admin login only when booking/inventory management becomes useful.
- No customer login until repeat bookings, payment history, or customer self-service justify it.
