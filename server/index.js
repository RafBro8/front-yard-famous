import { createServer } from 'node:http';
import { config } from './config.js';
import { createBookingStore } from './bookingStore.js';
import { inventoryCatalog, packageCatalog } from './catalog.js';
import { validateBookingPayload } from './validation.js';

const bookingStore = createBookingStore(config.bookingsDataFile);

const server = createServer(async (request, response) => {
  setCorsHeaders(request, response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, {
        ok: true,
        service: 'front-yard-famous-api',
        storage: 'local-json',
      });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/bookings') {
      sendJson(response, 200, { bookings: await bookingStore.list() });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/bookings') {
      const body = await readJsonBody(request);
      const validation = validateBookingPayload(body);

      if (validation.errors) {
        sendJson(response, 400, { errors: validation.errors });
        return;
      }

      const booking = await bookingStore.create(validation.value);

      sendJson(response, 201, {
        id: booking.id,
        status: booking.status,
        receivedAt: booking.createdAt,
        message: 'Booking request received for manual availability review.',
      });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/inventory') {
      sendJson(response, 200, {
        inventory: inventoryCatalog,
        packages: packageCatalog,
      });
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: 'Internal server error' });
  }
});

server.listen(config.port, '127.0.0.1', () => {
  console.log(`Front Yard Famous API running at http://127.0.0.1:${config.port}`);
});

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  const allowedOrigins = new Set([
    config.clientOrigin,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ]);

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }

  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}
