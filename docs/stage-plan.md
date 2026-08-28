# Front Yard Famous Stage Plan

## Working Agreement

- Build in stages, not one giant run.
- Ask before making commits.
- Use GitHub as the project source of truth.
- Prefer Ubuntu/WSL commands for the user-facing workflow.
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

Commit checkpoint:
- `feat: add backend persistence`

## Stage 7: Testing and Quality

Goal: add focused coverage and launch confidence.

Testing:
- Unit/component tests.
- API tests when backend exists.
- Playwright smoke tests.
- Accessibility checks.

Commit checkpoint:
- `test: add booking and public page coverage`

## Stage 8: Production Launch Prep

Goal: prepare for real customers.

Build:
- SEO metadata.
- Social previews.
- Favicon/brand assets.
- Analytics.
- Service area copy.
- Deployment environment setup.

Commit checkpoint:
- `chore: prepare production launch`

## Stage 9: Payments and Customer Accounts

Goal: add payment and accounts only when the business workflow needs them.

Recommendation:
- Add Stripe before customer accounts.
- Add customer accounts only for repeat booking history, saved event details, self-service changes, or payment receipts.

Commit checkpoint:
- `feat: add payment workflow`

## Stage 10: Yard Display Builder

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
