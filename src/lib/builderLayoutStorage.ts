import type { BuilderBookingLayout, BuilderCanvasPiece } from '../types/business';

const builderLayoutStorageKey = 'front-yard-famous.builder-layout';
const validShapes = new Set(['rectangle', 'circle', 'star', 'stork', 'cap']);
const validCategories = new Set(['letter', 'number', 'theme', 'baby', 'graduation', 'filler']);

export function createBuilderBookingLayout(layout: BuilderCanvasPiece[]): BuilderBookingLayout {
  const pieces = layout.map((piece) => ({
    ...piece,
    x: round(piece.x),
    y: round(piece.y),
    rotation: round(piece.rotation),
    scale: round(piece.scale),
  }));

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    summary: buildBuilderLayoutSummary(pieces),
    pieces,
  };
}

export function saveBuilderLayout(layout: BuilderCanvasPiece[]) {
  if (!canUseSessionStorage()) {
    return null;
  }

  const builderLayout = createBuilderBookingLayout(layout);
  window.sessionStorage.setItem(builderLayoutStorageKey, JSON.stringify(builderLayout));

  return builderLayout;
}

export function getSavedBuilderLayout(): BuilderBookingLayout | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const stored = window.sessionStorage.getItem(builderLayoutStorageKey);

  if (!stored) {
    return null;
  }

  try {
    return normalizeBuilderLayout(JSON.parse(stored));
  } catch {
    window.sessionStorage.removeItem(builderLayoutStorageKey);
    return null;
  }
}

export function clearSavedBuilderLayout() {
  if (canUseSessionStorage()) {
    window.sessionStorage.removeItem(builderLayoutStorageKey);
  }
}

export function buildBuilderLayoutSummary(layout: BuilderCanvasPiece[]) {
  if (layout.length === 0) {
    return 'No builder pieces selected.';
  }

  const counts = layout.reduce<Record<string, number>>((summary, piece) => {
    summary[piece.category] = (summary[piece.category] || 0) + 1;
    return summary;
  }, {});

  const categorySummary = Object.entries(counts)
    .map(([category, count]) => `${count} ${formatCategoryLabel(category, count)}`)
    .join(', ');

  return `${layout.length} pieces: ${categorySummary}.`;
}

function formatCategoryLabel(category: string, count: number) {
  const labels: Record<string, [string, string]> = {
    baby: ['baby', 'baby'],
    filler: ['filler', 'fillers'],
    graduation: ['graduation', 'graduation'],
    letter: ['message', 'messages'],
    number: ['number', 'numbers'],
    theme: ['theme', 'themes'],
  };
  const [single, plural] = labels[category] || [category, `${category}s`];

  return count === 1 ? single : plural;
}

function normalizeBuilderLayout(value: unknown): BuilderBookingLayout | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.pieces)) {
    return null;
  }

  const pieces = value.pieces
    .map(normalizePiece)
    .filter((piece): piece is BuilderCanvasPiece => piece !== null);

  if (pieces.length === 0) {
    return null;
  }

  return {
    version: 1,
    createdAt: readString(value.createdAt, new Date().toISOString()),
    summary: readString(value.summary, buildBuilderLayoutSummary(pieces)),
    pieces,
  };
}

function normalizePiece(value: unknown): BuilderCanvasPiece | null {
  if (!isRecord(value)) {
    return null;
  }

  const shape = readString(value.shape, 'rectangle');
  const category = readString(value.category, 'theme');

  if (!validShapes.has(shape) || !validCategories.has(category)) {
    return null;
  }

  return {
    id: readString(value.id, 'custom'),
    instanceId: readString(value.instanceId, `piece-${Date.now()}`),
    label: readString(value.label, 'Sign'),
    category: category as BuilderCanvasPiece['category'],
    color: readString(value.color, '#123526'),
    textColor: readString(value.textColor, '#fffdf8'),
    shape: shape as BuilderCanvasPiece['shape'],
    x: clamp(readNumber(value.x, 50), 0, 100),
    y: clamp(readNumber(value.y, 50), 0, 100),
    rotation: clamp(readNumber(value.rotation, 0), -45, 45),
    scale: clamp(readNumber(value.scale, 1), 0.5, 2),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function canUseSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage);
}
