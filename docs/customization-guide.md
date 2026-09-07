# Customization Guide

This project can be adapted for other local booking businesses that need a polished customer site plus a lightweight operations dashboard.

## Brand

- Update brand name and tagline in `src/App.tsx`, `index.html`, and README/docs.
- Replace `public/favicon.svg` with the final brand mark.
- Replace the hero image in `public/images`.
- Update color tokens in `tailwind.config.js`.

## Public Content

- Edit public navigation, occasions, gallery items, packages, add-ons, FAQs, and booking defaults in `src/data/siteContent.ts`.
- Keep the homepage concise and move deeper content into focused routes.
- Update service-area wording before any real launch.

## Demo Admin Data

- Edit seeded bookings in `server/demoData.js`.
- Edit inventory and package API data in `server/catalog.js`.
- Reset local demo state with `npm run demo:reset`.

## Deployment

- Use Vercel for the Vite frontend.
- Keep the API local for a portfolio demo, or deploy it to Render for a full-stack demo.
- Set `VITE_API_BASE_URL` if the frontend and API are hosted on different origins.
- Replace `https://big-day-yard-co-demo.vercel.app` in metadata, sitemap, robots, and docs when the final domain is chosen.

## Production Upgrade Path

- Replace local JSON persistence with a real database before accepting live customer requests.
- Add admin authentication before exposing real customer requests.
- Add email notifications for new booking requests.
- Add Stripe only when payment workflow is part of the product goal.
