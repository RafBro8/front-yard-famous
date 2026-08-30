import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../server/config.js';
import { demoBookings } from '../server/demoData.js';

await mkdir(path.dirname(config.bookingsDataFile), { recursive: true });
await writeFile(config.bookingsDataFile, `${JSON.stringify(demoBookings, null, 2)}\n`);

console.log(`Reset demo bookings at ${config.bookingsDataFile}`);
