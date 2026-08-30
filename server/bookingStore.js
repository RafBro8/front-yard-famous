import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function createBookingStore(filePath) {
  let seedBookings = [];

  async function readAll() {
    try {
      const content = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(content);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  async function writeAll(bookings) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(bookings, null, 2)}\n`);
  }

  function getSourceBookings(bookings) {
    if (bookings.length === 0 && seedBookings.length > 0) {
      return [...seedBookings];
    }

    return bookings;
  }

  return {
    seed(bookings) {
      seedBookings = Array.isArray(bookings) ? bookings : [];
      return this;
    },

    async list() {
      const bookings = await readAll();
      return getSourceBookings(bookings).sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      );
    },

    async create(payload) {
      const bookings = await readAll();
      const source = getSourceBookings(bookings);
      const createdAt = new Date().toISOString();
      const nextNumber =
        source
          .map((booking) => Number.parseInt(String(booking.id).replace('FYF-', ''), 10))
          .filter(Number.isFinite)
          .sort((left, right) => right - left)[0] || 1000;
      const booking = {
        id: `FYF-${String(nextNumber + 1).padStart(4, '0')}`,
        status: 'new',
        createdAt,
        updatedAt: createdAt,
        ...payload,
      };

      await writeAll([...source, booking]);

      return booking;
    },

    async updateStatus(id, status) {
      const bookings = await readAll();
      const source = getSourceBookings(bookings);
      const bookingIndex = source.findIndex((booking) => booking.id === id);

      if (bookingIndex === -1) {
        return null;
      }

      const updatedBooking = {
        ...source[bookingIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      const updatedBookings = [
        ...source.slice(0, bookingIndex),
        updatedBooking,
        ...source.slice(bookingIndex + 1),
      ];

      await writeAll(updatedBookings);

      return updatedBooking;
    },
  };
}
