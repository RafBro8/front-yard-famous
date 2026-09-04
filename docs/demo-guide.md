# Front Yard Famous Demo Guide

Front Yard Famous is currently framed as a portfolio-ready product demo for a local yard sign, stork, and celebration display business.

## Run the Demo

Use two terminals from the project root.

Terminal 1:

```cmd
npm run dev
```

Terminal 2:

```cmd
npm run dev:api
```

Open:

- `http://localhost:5173`
- `http://localhost:5173/admin`

## Reset Demo Data

The admin dashboard uses local JSON persistence during development. Reset the seeded request queue with:

```cmd
npm run demo:reset
```

The reset writes demo bookings to `.data/booking-requests.json`.

## Demo Flow

1. Open `/` and show the modern customer-facing homepage.
2. Move through `/occasions`, `/gallery`, and `/pricing` to show the cleaner page structure.
3. Open `/builder`, filter the sample inventory, add pieces, drag them on the yard canvas, and download the SVG preview.
4. Use the layout in booking, then confirm the builder concept summary is attached on `/booking`.
5. Submit a sample request, open `/admin`, and show the booking queue, visual builder preview, status controls, inventory availability, packages, and blackout dates.
6. Change a booking status and show the success message.
7. Run `npm run demo:reset` to restore the original seeded queue before another walkthrough.

## API Checks

```cmd
curl http://127.0.0.1:4000/api/health
curl http://127.0.0.1:4000/api/bookings
curl http://127.0.0.1:4000/api/inventory
```

## Quality Check

```cmd
npm test
```
