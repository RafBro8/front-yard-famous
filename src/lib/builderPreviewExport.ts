import { createBuilderBookingLayout } from './builderLayoutStorage';
import type { BuilderCanvasPiece } from '../types/business';

const previewWidth = 1200;
const previewHeight = 800;

export function downloadBuilderPreview(layout: BuilderCanvasPiece[]) {
  const bookingLayout = createBuilderBookingLayout(layout);
  const svg = createBuilderPreviewSvg(bookingLayout.pieces);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `front-yard-famous-builder-${Date.now()}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return bookingLayout;
}

export function createBuilderPreviewSvg(layout: BuilderCanvasPiece[]) {
  const pieces = layout.map(renderPieceSvg).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${previewWidth}" height="${previewHeight}" viewBox="0 0 ${previewWidth} ${previewHeight}" role="img" aria-label="Front Yard Famous yard display preview">
  <rect width="1200" height="800" fill="#fff8ec"/>
  <rect x="90" y="84" width="1020" height="290" fill="#dff4e8" stroke="#17211b" stroke-opacity="0.08"/>
  <rect x="0" y="368" width="1200" height="432" fill="#4f9a68"/>
  <rect x="0" y="344" width="1200" height="64" fill="#246b45"/>
  <rect x="150" y="132" width="220" height="92" fill="#ffffff" fill-opacity="0.42" stroke="#17211b" stroke-opacity="0.08"/>
  <rect x="792" y="120" width="252" height="112" fill="#ffffff" fill-opacity="0.5" stroke="#17211b" stroke-opacity="0.08"/>
  <line x1="96" x2="1104" y1="660" y2="660" stroke="#ffffff" stroke-opacity="0.36"/>
  <line x1="216" x2="984" y1="704" y2="704" stroke="#ffffff" stroke-opacity="0.18"/>
  ${pieces}
</svg>`;
}

function renderPieceSvg(piece: BuilderCanvasPiece) {
  const { height, width } = getPieceDimensions(piece.shape);
  const x = (piece.x / 100) * previewWidth;
  const y = (piece.y / 100) * previewHeight;
  const escapedLabel = escapeXml(piece.shape === 'star' ? 'STAR' : piece.label);

  return `
  <g transform="translate(${round(x)} ${round(y)}) rotate(${round(piece.rotation)}) scale(${round(piece.scale)})">
    ${piece.shape === 'star' ? '' : `<rect x="-3" y="${round(height / 2 - 4)}" width="6" height="${round(height * 0.42)}" fill="#17211b" opacity="0.42"/>`}
    ${renderPieceFace(piece, width, height)}
    <text x="0" y="5" text-anchor="middle" dominant-baseline="middle" fill="${escapeXml(piece.textColor)}" font-family="Georgia, serif" font-size="${getFontSize(piece.shape)}" font-weight="700">${escapedLabel}</text>
  </g>`;
}

function renderPieceFace(piece: BuilderCanvasPiece, width: number, height: number) {
  const color = escapeXml(piece.color);

  if (piece.shape === 'circle') {
    return `<circle r="${round(width / 2)}" fill="${color}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>`;
  }

  if (piece.shape === 'star') {
    return `<polygon points="0,-42 12,-12 44,-12 18,7 28,39 0,20 -28,39 -18,7 -44,-12 -12,-12" fill="${color}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>`;
  }

  if (piece.shape === 'stork') {
    return `<rect x="${round(-width / 2)}" y="${round(-height / 2)}" width="${width}" height="${height}" rx="38" fill="${color}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>`;
  }

  if (piece.shape === 'cap') {
    return `<polygon points="0,${round(-height / 2)} ${round(width / 2)},${round(-height * 0.08)} 0,${round(height * 0.34)} ${round(-width / 2)},${round(-height * 0.08)}" fill="${color}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>`;
  }

  return `<rect x="${round(-width / 2)}" y="${round(-height / 2)}" width="${width}" height="${height}" fill="${color}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>`;
}

function getPieceDimensions(shape: BuilderCanvasPiece['shape']) {
  if (shape === 'circle') {
    return { height: 96, width: 96 };
  }

  if (shape === 'star') {
    return { height: 88, width: 88 };
  }

  if (shape === 'stork') {
    return { height: 132, width: 88 };
  }

  if (shape === 'cap') {
    return { height: 72, width: 126 };
  }

  return { height: 70, width: 170 };
}

function getFontSize(shape: BuilderCanvasPiece['shape']) {
  if (shape === 'circle') {
    return 44;
  }

  if (shape === 'star' || shape === 'cap' || shape === 'stork') {
    return 20;
  }

  return 28;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
