# Visual QA Notes

Stage 10.5 checked the customer homepage, booking page, and admin dashboard at desktop and mobile widths. Stage 11A added the same visual pass for the yard display builder.

## Viewports

- Desktop: 1440 by 1000.
- Mobile: 390 by 844.

## Routes Checked

- `/`
- `/booking`
- `/builder`
- `/admin`

## Results

- No horizontal overflow detected.
- No broken images detected.
- Route-specific page titles rendered.
- Homepage hero image loaded on desktop and mobile.
- Builder canvas loaded on desktop and mobile with six starter pieces.
- Builder drag interaction moved a selected piece successfully.
- Admin dashboard loaded seeded API data.
- Booking and admin pages now expose a visible page `h1`.

## Captured Screenshots

- `docs/screenshots/home-desktop.png`
- `docs/screenshots/booking-desktop.png`
- `docs/screenshots/builder-desktop.png`
- `docs/screenshots/admin-desktop.png`
- `docs/screenshots/home-mobile.png`
- `docs/screenshots/booking-mobile.png`
- `docs/screenshots/builder-mobile.png`
- `docs/screenshots/admin-mobile.png`

## Follow-Up Polish

- Add Playwright screenshots to automated tests when browser test dependencies are introduced.
- Add final hosted URLs after deployment.
- Replace placeholder domain references if `fyf.com` is not the final demo URL.
