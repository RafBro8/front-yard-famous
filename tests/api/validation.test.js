import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateBookingPayload } from '../../server/validation.js';

const validPayload = {
  name: 'Jordan Miller',
  email: 'Jordan@example.com',
  phone: '(555) 555-1212',
  occasion: 'Birthday',
  eventDate: '2026-09-12',
  setupWindow: 'Evening before',
  serviceArea: 'West Loop',
  honoreeName: 'Jordan',
  displayMessage: 'Happy 30th Jordan',
  themeNotes: 'Modern stars and bright colors',
};

describe('validateBookingPayload', () => {
  it('normalizes a valid booking request', () => {
    const result = validateBookingPayload(validPayload);

    assert.equal(result.errors, undefined);
    assert.equal(result.value.email, 'jordan@example.com');
    assert.equal(result.value.name, 'Jordan Miller');
    assert.equal(result.value.themeNotes, 'Modern stars and bright colors');
  });

  it('returns field errors for missing required values', () => {
    const result = validateBookingPayload({
      ...validPayload,
      displayMessage: '',
      email: 'not-an-email',
      phone: '555',
    });

    assert.equal(result.value, undefined);
    assert.equal(result.errors.displayMessage, 'Required field is missing.');
    assert.equal(result.errors.email, 'Enter a valid email address.');
    assert.equal(result.errors.phone, 'Enter a phone number with area code.');
  });

  it('rejects non-object request bodies', () => {
    const result = validateBookingPayload(null);

    assert.deepEqual(result, {
      errors: {
        request: 'Request body must be an object.',
      },
    });
  });
});
