# Big Day Yard Co. Deployment Checklist

## Demo Domain

- Use a demo-safe Vercel project name such as `big-day-yard-co-demo`.
- Keep protected real business domains and names out of the public demo.
- Replace `https://big-day-yard-co-demo.vercel.app` in metadata, sitemap, robots, and docs if the demo URL changes.

## Frontend

- Deploy the Vite frontend to Vercel.
- Set `VITE_API_BASE_URL` to the Render API origin, for example `https://big-day-yard-co-api.onrender.com`.
- Confirm direct refreshes work for:
  - `/`
  - `/occasions`
  - `/gallery`
  - `/pricing`
  - `/builder`
  - `/booking`
  - `/faq`
  - `/admin`

## Backend

- Deploy the Node API to Render.
- Use `npm run start:api` as the Render start command.
- Set `HOST=0.0.0.0` so Render can route traffic to the service.
- Set `CLIENT_ORIGIN` to the Vercel demo origin.
- Keep `.data` local storage for development only.
- Use `/tmp/big-day-yard-co-bookings.json` for Render demo storage.
- Expect demo bookings/status changes to reset when the Render service restarts.

## Metadata

- Confirm each route has the expected page title and description.
- Confirm social previews use the final production URL.
- Confirm the social preview image is crisp and representative of the business.
- Submit the sitemap only if the demo becomes a public indexed site.

## Booking Flow

- Start the API.
- Submit a booking request from `/booking`.
- Confirm the request is saved by checking `GET /api/bookings`.
- Confirm failed API submissions show a useful message to the customer.

## Prelaunch Review

- Run `npm test`.
- Review mobile and desktop layouts.
- Replace placeholder email/domain copy with final business details.
- Add analytics only after deciding what needs to be measured.
