# Front Yard Famous Stage Plan

## Working Agreement

- Build in stages, not one giant run.
- Ask before making commits.
- Use GitHub as the project source of truth.
- Prefer Windows PowerShell commands for the user-facing workflow.
- Keep customer login out of v1 unless a later stage proves it is needed.

## Stage 0: Product Direction and Repo Setup

Goal: establish the app foundation.

Deliverables:
- React/Vite/TypeScript scaffold.
- Tailwind CSS.
- Initial README.
- Stage plan in the repo.
- Clean local verification.

Commit checkpoint:
- `chore: scaffold front yard famous app`

## Stage 1: Brand and Visual Prototype

Goal: make the first version feel beautiful, modern, joyful, and credible.

Build:
- Homepage first viewport.
- Navigation.
- Occasion highlights.
- Brand colors, typography, spacing, and reusable visual language.
- Mobile-first responsive layout.

Commit checkpoint:
- `feat: add branded homepage prototype`

## Stage 2: Core Public Pages

Goal: turn the prototype into a useful public site.

Build:
- Home.
- Occasions.
- Gallery.
- Pricing.
- Booking request.
- FAQ / Policies.
- Contact.

Commit checkpoint:
- `feat: add public site pages`

## Stage 3: Booking Inquiry Flow

Goal: let customers request a setup without login or payment.

Build:
- Occasion type.
- Preferred date.
- Setup time window.
- Address/service area.
- Customer contact info.
- Theme/color preferences.
- Notes.
- Validation and confirmation message.

Commit checkpoint:
- `feat: add booking inquiry flow`

## Stage 4: Inventory and Pricing Model

Goal: organize products, packages, add-ons, gallery items, and availability.

Build:
- Shared TypeScript business models.
- Structured frontend data files for public content.
- Package tiers with starting prices, included items, best-fit occasions, and upgrade options.
- Add-on options focused on yard signs and setup pieces.
- Inventory examples for letters, numbers, storks, graduation pieces, fillers, and setup hardware.
- Availability rules that support manual confirmation now and backend scheduling later.

Commit checkpoint:
- `feat: model packages and inventory data`

## Stage 5: Admin Area

Goal: private management for bookings, inventory, pricing, and blackout dates.

Build:
- Separate `/admin` view that keeps customer pages clean.
- Booking request queue with statuses: New, Reviewing, Confirmed, Declined, and Completed.
- Admin metrics for new requests, confirmed bookings, inventory flags, and blackout dates.
- Inventory priority panel using the shared business data model.
- Package/pricing management preview.
- Blackout date planning panel for unavailable dates.
- Frontend-only structure that can later connect to auth, MongoDB, and API routes.

Commit checkpoint:
- `feat: add admin booking management`

## Stage 6: Backend and Persistence

Goal: add durable booking and inventory data.

Possible stack:
- Node/Express.
- MongoDB Atlas.
- Vercel frontend.
- Render or serverless API hosting.

Build:
- Lightweight Node API without external backend packages for the first persistence pass.
- `POST /api/bookings` for customer booking requests.
- `GET /api/bookings` for admin review workflows.
- `GET /api/inventory` for future inventory-backed admin screens.
- Local JSON persistence in `.data/booking-requests.json`.
- Vite proxy from `/api` to the local API during development.
- Environment example for API port, client origin, local data file, and future Mongo URI.

Next backend pass:
- Add Express once npm registry access is reliable in the working environment.
- Add MongoDB Atlas persistence behind the same booking store interface.
- Add admin-only auth before exposing real booking management publicly.

Commit checkpoint:
- `feat: add backend persistence`

## Stage 7: Testing and Quality

Goal: add focused coverage and launch confidence.

Testing:
- Unit/component tests.
- API tests when backend exists.
- Playwright smoke tests.
- Accessibility checks.

Build:
- Node built-in test runner for backend tests without new package installs.
- Validation tests for booking request payloads.
- API route tests for health, booking create/list, invalid payloads, malformed JSON, and inventory data.
- `npm run test:api` for backend tests.
- `npm test` for lint, build, and API tests in one command.
- Server refactor that allows tests to start the API on a random port.

Deferred:
- Add Vitest and React Testing Library once the project is ready for additional test dependencies.
- Add Playwright smoke tests after the frontend and API dev servers are stable together.

Commit checkpoint:
- `test: add booking and public page coverage`

## Stage 7.5: Public Site Structure and Navigation Cleanup

Goal: make the customer site feel cleaner and less like a crammed single-page prototype.

Build:
- Route-aware public site without adding a router dependency.
- Lightweight homepage with hero, occasion preview, gallery preview, and booking call-to-action.
- Dedicated customer pages for `/occasions`, `/gallery`, `/pricing`, `/booking`, and `/faq`.
- Shared header and footer across public pages.
- Navigation links that move customers to focused pages instead of scrolling through one long homepage.
- Keep `/admin` separate from customer navigation and customer content.

Commit checkpoint:
- `refactor: split public site into focused pages`

## Stage 8: Production Launch Prep

Goal: prepare for real customers.

Build:
- SEO metadata.
- Social previews.
- Favicon/brand assets.
- Analytics.
- Service area copy.
- Deployment environment setup.
- Route-specific browser titles and descriptions.
- Static `robots.txt`, `sitemap.xml`, and web app manifest.
- Vercel rewrite for direct refreshes on client-rendered routes.
- Deployment checklist for frontend, backend, API URL, domain, and launch validation.

Commit checkpoint:
- `chore: prepare production launch`

## Stage 9: Demo Product Polish and Admin Workflow

Goal: shift the project into a polished, sellable portfolio demo with a stronger admin workflow.

Build:
- Make the admin dashboard feel more complete and premium.
- Connect the admin dashboard to local/demo API data instead of static mock data.
- Add seeded demo bookings.
- Add booking status update interactions.
- Add inventory availability view with reserved/open counts.
- Add polished loading, empty, and error states.
- Add portfolio-ready README content covering problem, solution, stack, demo features, and screenshots to add.

Commit checkpoint:
- `feat: polish demo admin workflow`

## Stage 10: Deployable Demo and Case Study

Goal: make the project easy to showcase, review, and sell as a demo product.

Build:
- Add guided demo instructions.
- Add resettable seeded demo data.
- Add screenshots or short screen recordings.
- Add demo instructions and customization notes.
- Add a portfolio case-study writeup.
- Add buyer/client customization notes.
- Decide whether to deploy the demo API or keep it local-only.
- Optional demo credentials if auth is introduced.

Commit checkpoint:
- `docs: add demo case study`

## Stage 10.5: Visual QA and Polish

Goal: make the demo feel screenshot-ready on desktop and mobile.

Build:
- Review homepage, booking page, and admin dashboard at desktop and mobile widths.
- Check route loading, typography scale, spacing, button alignment, and image framing.
- Tighten visible copy that makes the app feel like a prototype instead of a polished demo.
- Confirm the app remains readable when the API is unavailable.
- Run the full test suite after visual changes.

Commit checkpoint:
- `style: polish demo visual qa`

## Stage 11: Yard Display Builder

Goal: let customers experiment with available inventory and submit a visual display concept.

Build:
- Browse available sign pieces, numbers, icons, and theme fillers.
- Drag and arrange pieces on a yard-style canvas.
- Save the layout as structured JSON.
- Export a visual preview for the customer and admin.
- Attach the preview to a booking request.

Recommendation:
- Treat this as a later differentiator after real inventory, pricing rules, and booking operations are proven.

Commit checkpoint:
- `feat: add yard display builder`

## Stage 12: Payments and Customer Accounts

Goal: add payment and accounts only if the project shifts back toward a real business workflow.

Recommendation:
- Add Stripe before customer accounts.
- Add customer accounts only for repeat booking history, saved event details, self-service changes, or payment receipts.

Commit checkpoint:
- `feat: add payment workflow`
