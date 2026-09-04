import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateBookingPayload } from '../../server/validation.js';

const validBuilderLayout = {
  version: 1,
  createdAt: '2026-08-27T14:18:00.000Z',
  summary: '3 pieces: 2 letters, 1 number.',
  pieces: [
    {
      id: 'happy',
      instanceId: 'layout-happy',
      label: 'HAPPY',
      category: 'letter',
      color: '#123526',
      textColor: '#fffdf8',
      shape: 'rectangle',
      x: 18,
      y: 30,
      rotation: -3,
      scale: 1,
    },
  ],
};

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
    assert.equal(result.value.builderLayout, null);
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
  it('normalizes a valid builder layout', () => {
    const result = validateBookingPayload({
      ...validPayload,
      builderLayout: {
        ...validBuilderLayout,
        pieces: [
          {
            ...validBuilderLayout.pieces[0],
            rotation: 80,
            scale: 4,
          },
        ],
      },
    });

    assert.equal(result.errors, undefined);
    assert.equal(result.value.builderLayout.summary, '3 pieces: 2 letters, 1 number.');
    assert.equal(result.value.builderLayout.pieces[0].rotation, 45);
    assert.equal(result.value.builderLayout.pieces[0].scale, 2);
  });

  it('rejects invalid builder layout pieces', () => {
    const result = validateBookingPayload({
      ...validPayload,
      builderLayout: {
        ...validBuilderLayout,
        pieces: [{ ...validBuilderLayout.pieces[0], category: 'unknown' }],
      },
    });

    assert.equal(result.value, undefined);
    assert.equal(result.errors.builderLayout, 'Builder layout includes an invalid piece.');
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
