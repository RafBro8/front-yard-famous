import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { createApiServer } from '../../server/index.js';
import { createBookingStore } from '../../server/bookingStore.js';

const validPayload = {
  name: 'Avery Chen',
  email: 'avery@example.com',
  phone: '(555) 555-3434',
  occasion: 'New baby',
  eventDate: '2026-09-18',
  setupWindow: 'Morning of event',
  serviceArea: 'Oak Park',
  honoreeName: 'Noah',
  displayMessage: 'Welcome Home Baby Noah',
  themeNotes: 'Soft greens and stars',
};

describe('Front Yard Famous API', () => {
  let baseUrl;
  let server;
  let tempDirectory;

  before(async () => {
    tempDirectory = await mkdtemp(path.join(tmpdir(), 'fyf-api-test-'));
    const bookingStore = createBookingStore(path.join(tempDirectory, 'bookings.json'));
    server = createApiServer({ bookingStore, storage: 'test-json' });

    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await rm(tempDirectory, { force: true, recursive: true });
  });

  it('returns health metadata', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      ok: true,
      service: 'front-yard-famous-api',
      storage: 'test-json',
    });
  });

  it('rejects invalid booking requests', async () => {
    const response = await fetch(`${baseUrl}/api/bookings`, {
      body: JSON.stringify({ ...validPayload, email: 'bad-email', phone: '123' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.errors.email, 'Enter a valid email address.');
    assert.equal(body.errors.phone, 'Enter a phone number with area code.');
  });

  it('rejects malformed JSON request bodies', async () => {
    const response = await fetch(`${baseUrl}/api/bookings`, {
      body: '{"name":',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
      error: 'Request body must be valid JSON.',
    });
  });

  it('creates and lists booking requests', async () => {
    const createResponse = await fetch(`${baseUrl}/api/bookings`, {
      body: JSON.stringify(validPayload),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const created = await createResponse.json();

    assert.equal(createResponse.status, 201);
    assert.equal(created.id, 'FYF-1001');
    assert.equal(created.status, 'new');

    const listResponse = await fetch(`${baseUrl}/api/bookings`);
    const list = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(list.bookings.length, 1);
    assert.equal(list.bookings[0].email, 'avery@example.com');
    assert.equal(list.bookings[0].displayMessage, 'Welcome Home Baby Noah');
  });

  it('returns starter inventory and package data', async () => {
    const response = await fetch(`${baseUrl}/api/inventory`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.inventory.length > 0);
    assert.ok(body.packages.length > 0);
  });
});
