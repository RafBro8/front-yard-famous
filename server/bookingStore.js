import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function createBookingStore(filePath) {
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

  return {
    async list() {
      const bookings = await readAll();
      return bookings.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    },

    async create(payload) {
      const bookings = await readAll();
      const createdAt = new Date().toISOString();
      const booking = {
        id: `FYF-${String(bookings.length + 1001).padStart(4, '0')}`,
        status: 'new',
        createdAt,
        updatedAt: createdAt,
        ...payload,
      };

      bookings.push(booking);
      await writeAll(bookings);

      return booking;
    },
  };
}
