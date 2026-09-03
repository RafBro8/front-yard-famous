# Front Yard Famous Deployment Checklist

## Domain

- Confirm the production domain before launch.
- Replace `https://fyf.com` in metadata, sitemap, robots, and docs if the final domain changes.
- Decide whether the site should use the apex domain, `www`, or both.

## Frontend

- Deploy the Vite frontend to Vercel.
- Set `VITE_API_BASE_URL` to the production API origin when the backend is hosted separately.
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

- Deploy the Node API to Render or another backend host.
- Set `PORT` according to the host platform.
- Set `CLIENT_ORIGIN` to the production frontend origin.
- Keep `.data` local storage for development only.
- Move production bookings to Mongo Atlas before accepting real customer requests at scale.

## Metadata

- Confirm each route has the expected page title and description.
- Confirm social previews use the final production URL.
- Confirm the social preview image is crisp and representative of the business.
- Submit the sitemap after the final domain is live.

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
