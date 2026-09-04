const validBuilderCategories = new Set(['letter', 'number', 'theme', 'baby', 'graduation', 'filler']);
const validBuilderShapes = new Set(['rectangle', 'circle', 'star', 'stork', 'cap']);

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

  const builderLayout = validateBuilderLayout(payload.builderLayout);

  if (builderLayout.error) {
    errors.builderLayout = builderLayout.error;
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
      builderLayout: builderLayout.value,
    },
  };
}

function validateBuilderLayout(layout) {
  if (layout === undefined || layout === null) {
    return { value: null };
  }

  if (!layout || typeof layout !== 'object' || Array.isArray(layout)) {
    return { error: 'Builder layout must be an object.' };
  }

  if (layout.version !== 1) {
    return { error: 'Builder layout version is not supported.' };
  }

  if (!Array.isArray(layout.pieces) || layout.pieces.length === 0) {
    return { error: 'Builder layout must include at least one piece.' };
  }

  if (layout.pieces.length > 40) {
    return { error: 'Builder layout cannot include more than 40 pieces.' };
  }

  const pieces = [];

  for (const piece of layout.pieces) {
    const normalizedPiece = normalizeBuilderPiece(piece);

    if (!normalizedPiece) {
      return { error: 'Builder layout includes an invalid piece.' };
    }

    pieces.push(normalizedPiece);
  }

  return {
    value: {
      version: 1,
      createdAt: typeof layout.createdAt === 'string' ? layout.createdAt : new Date().toISOString(),
      summary: typeof layout.summary === 'string' && layout.summary.trim().length > 0
        ? layout.summary.trim()
        : `${pieces.length} builder pieces attached.`,
      pieces,
    },
  };
}

function normalizeBuilderPiece(piece) {
  if (!piece || typeof piece !== 'object' || Array.isArray(piece)) {
    return null;
  }

  if (!validBuilderCategories.has(piece.category) || !validBuilderShapes.has(piece.shape)) {
    return null;
  }

  const requiredPieceStrings = ['id', 'instanceId', 'label', 'color', 'textColor'];

  for (const field of requiredPieceStrings) {
    if (typeof piece[field] !== 'string' || piece[field].trim().length === 0) {
      return null;
    }
  }

  return {
    id: piece.id.trim(),
    instanceId: piece.instanceId.trim(),
    label: piece.label.trim(),
    category: piece.category,
    color: piece.color.trim(),
    textColor: piece.textColor.trim(),
    shape: piece.shape,
    x: clampNumber(piece.x, 0, 100),
    y: clampNumber(piece.y, 0, 100),
    rotation: clampNumber(piece.rotation, -45, 45),
    scale: clampNumber(piece.scale, 0.5, 2),
  };
}

function clampNumber(value, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}