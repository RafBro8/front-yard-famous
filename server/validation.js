const requiredStringFields = [
  'name',
  'email',
  'phone',
  'occasion',
  'eventDate',
  'setupWindow',
  'serviceArea',
  'honoreeName',
  'displayMessage',
];

export function validateBookingPayload(payload) {
  const errors = {};

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { errors: { request: 'Request body must be an object.' } };
  }

  for (const field of requiredStringFields) {
    if (typeof payload[field] !== 'string' || payload[field].trim().length === 0) {
      errors[field] = 'Required field is missing.';
    }
  }

  if (typeof payload.email === 'string' && !/^\S+@\S+\.\S+$/.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (typeof payload.phone === 'string' && payload.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a phone number with area code.';
  }

  if (typeof payload.eventDate === 'string' && Number.isNaN(Date.parse(`${payload.eventDate}T00:00:00`))) {
    errors.eventDate = 'Enter a valid event date.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    value: {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      occasion: payload.occasion.trim(),
      eventDate: payload.eventDate,
      setupWindow: payload.setupWindow.trim(),
      serviceArea: payload.serviceArea.trim(),
      honoreeName: payload.honoreeName.trim(),
      displayMessage: payload.displayMessage.trim(),
      themeNotes: typeof payload.themeNotes === 'string' ? payload.themeNotes.trim() : '',
    },
  };
}
