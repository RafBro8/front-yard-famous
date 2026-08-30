import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { createBookingStore } from '../../server/bookingStore.js';

const seededBookings = [
  {
    id: 'FYF-1024',
    status: 'new',
    createdAt: '2026-08-27T14:20:00.000Z',
    updatedAt: '2026-08-27T14:20:00.000Z',
    name: 'Jordan Miller',
    email: 'jordan@example.com',
    phone: '(555) 555-1212',
    occasion: 'Birthday',
    eventDate: '2026-09-12',
    setupWindow: 'Evening before',
    serviceArea: 'West Loop',
    honoreeName: 'Jordan',
    displayMessage: 'Happy 30th Jordan',
    themeNotes: 'Bright colors',
  },
];

const bookingPayload = {
  name: 'New Customer',
  email: 'new@example.com',
  phone: '(555) 555-2222',
  occasion: 'Graduation',
  eventDate: '2026-10-05',
  setupWindow: 'Morning of event',
  serviceArea: 'Elmhurst',
  honoreeName: 'Ava',
  displayMessage: 'Congrats Ava',
  themeNotes: 'Blue and silver',
};

describe('createBookingStore', () => {
  let tempDirectory;
  let store;

  before(async () => {
    tempDirectory = await mkdtemp(path.join(tmpdir(), 'fyf-store-test-'));
    store = createBookingStore(path.join(tempDirectory, 'bookings.json')).seed(seededBookings);
  });

  after(async () => {
    await rm(tempDirectory, { force: true, recursive: true });
  });

  it('lists seeded demo bookings before a data file exists', async () => {
    const bookings = await store.list();

    assert.equal(bookings.length, 1);
    assert.equal(bookings[0].id, 'FYF-1024');
  });

  it('creates bookings after the highest seeded id', async () => {
    const booking = await store.create(bookingPayload);

    assert.equal(booking.id, 'FYF-1025');
    assert.equal(booking.status, 'new');

    const bookings = await store.list();
    assert.equal(bookings.length, 2);
  });

  it('updates seeded or persisted booking status', async () => {
    const booking = await store.updateStatus('FYF-1024', 'confirmed');

    assert.equal(booking.id, 'FYF-1024');
    assert.equal(booking.status, 'confirmed');
  });
});
