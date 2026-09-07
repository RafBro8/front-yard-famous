import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { config } from './config.js';
import { createBookingStore } from './bookingStore.js';
import { inventoryCatalog, packageCatalog } from './catalog.js';
import { demoBookings } from './demoData.js';
import { validateBookingPayload } from './validation.js';

const bookingStatuses = new Set(['new', 'reviewing', 'confirmed', 'declined', 'completed']);

export function createApiServer({
  bookingStore = createBookingStore(config.bookingsDataFile).seed(demoBookings),
  storage = 'local-json',
} = {}) {
  return createServer(async (request, response) => {
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
          service: 'big-day-yard-co-api',
          storage,
        });
        return;
      }

      if (request.method === 'GET' && url.pathname === '/api/bookings') {
        sendJson(response, 200, { bookings: await bookingStore.list() });
        return;
      }

      const bookingStatusMatch = url.pathname.match(/^\/api\/bookings\/([^/]+)\/status$/);

      if (request.method === 'PATCH' && bookingStatusMatch) {
        const body = await readJsonBody(request).catch((error) => {
          if (error instanceof SyntaxError) {
            sendJson(response, 400, { error: 'Request body must be valid JSON.' });
            return null;
          }

          throw error;
        });

        if (body === null) {
          return;
        }

        if (!body || typeof body.status !== 'string' || !bookingStatuses.has(body.status)) {
          sendJson(response, 400, { error: 'Choose a valid booking status.' });
          return;
        }

        const booking = await bookingStore.updateStatus(
          decodeURIComponent(bookingStatusMatch[1]),
          body.status,
        );

        if (!booking) {
          sendJson(response, 404, { error: 'Booking request not found.' });
          return;
        }

        sendJson(response, 200, { booking });
        return;
      }

      if (request.method === 'POST' && url.pathname === '/api/bookings') {
        const body = await readJsonBody(request).catch((error) => {
          if (error instanceof SyntaxError) {
            sendJson(response, 400, { error: 'Request body must be valid JSON.' });
            return null;
          }

          throw error;
        });

        if (body === null) {
          return;
        }

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
}

export function startApiServer({ port = config.port, host = config.host } = {}) {
  const server = createApiServer();

  server.listen(port, host, () => {
    console.log(`Big Day Yard Co. API running at http://${host}:${port}`);
  });

  return server;
}

if (isMainModule()) {
  startApiServer();
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  const allowedOrigins = new Set([
    ...config.clientOrigins,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ]);

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }

  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function isMainModule() {
  return process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
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
