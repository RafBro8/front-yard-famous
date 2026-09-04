import type { BuilderCanvasPiece, BuilderPieceTemplate } from '../types/business';

export const builderPieceFilters = [
  { id: 'all', label: 'All' },
  { id: 'letter', label: 'Messages' },
  { id: 'number', label: 'Numbers' },
  { id: 'theme', label: 'Themes' },
  { id: 'baby', label: 'Baby' },
  { id: 'graduation', label: 'Grad' },
  { id: 'filler', label: 'Fillers' },
] as const;

export const builderPieces: BuilderPieceTemplate[] = [
  {
    id: 'happy',
    label: 'HAPPY',
    category: 'letter',
    color: '#123526',
    textColor: '#fffdf8',
    shape: 'rectangle',
  },
  {
    id: 'birthday',
    label: 'BIRTHDAY',
    category: 'letter',
    color: '#f26b5b',
    textColor: '#fffdf8',
    shape: 'rectangle',
  },
  {
    id: 'name',
    label: 'MIA',
    category: 'letter',
    color: '#246b45',
    textColor: '#fffdf8',
    shape: 'rectangle',
  },
  {
    id: 'age',
    label: '8',
    category: 'number',
    color: '#f7d56f',
    textColor: '#17211b',
    shape: 'circle',
  },
  {
    id: 'cake',
    label: 'Cake',
    category: 'theme',
    color: '#d9d0ff',
    textColor: '#17211b',
    shape: 'rectangle',
  },
  {
    id: 'cheers',
    label: 'CHEERS',
    category: 'theme',
    color: '#fffdf8',
    textColor: '#123526',
    shape: 'rectangle',
  },
  {
    id: 'welcome',
    label: 'WELCOME',
    category: 'baby',
    color: '#cbe7f8',
    textColor: '#17211b',
    shape: 'rectangle',
  },
  {
    id: 'stork',
    label: 'Stork',
    category: 'baby',
    color: '#cbe7f8',
    textColor: '#17211b',
    shape: 'stork',
  },
  {
    id: 'baby',
    label: 'BABY',
    category: 'baby',
    color: '#fff8ec',
    textColor: '#246b45',
    shape: 'rectangle',
  },
  {
    id: 'grad-cap',
    label: 'Cap',
    category: 'graduation',
    color: '#17211b',
    textColor: '#fffdf8',
    shape: 'cap',
  },
  {
    id: 'class-year',
    label: '2027',
    category: 'graduation',
    color: '#246b45',
    textColor: '#fffdf8',
    shape: 'rectangle',
  },
  {
    id: 'sparkle',
    label: 'Sparkle',
    category: 'filler',
    color: '#d9d0ff',
    textColor: '#17211b',
    shape: 'star',
  },
  {
    id: 'star',
    label: 'Star',
    category: 'filler',
    color: '#f7d56f',
    textColor: '#17211b',
    shape: 'star',
  },
];

export const initialBuilderLayout: BuilderCanvasPiece[] = [
  {
    ...findBuilderPiece('happy'),
    instanceId: 'layout-happy',
    x: 18,
    y: 30,
    rotation: -3,
    scale: 1,
  },
  {
    ...findBuilderPiece('birthday'),
    instanceId: 'layout-birthday',
    x: 44,
    y: 30,
    rotation: 2,
    scale: 1,
  },
  {
    ...findBuilderPiece('name'),
    instanceId: 'layout-name',
    x: 38,
    y: 53,
    rotation: -1,
    scale: 1.1,
  },
  {
    ...findBuilderPiece('age'),
    instanceId: 'layout-age',
    x: 67,
    y: 50,
    rotation: 5,
    scale: 1.18,
  },
  {
    ...findBuilderPiece('star'),
    instanceId: 'layout-star-left',
    x: 26,
    y: 55,
    rotation: -12,
    scale: 0.82,
  },
  {
    ...findBuilderPiece('star'),
    instanceId: 'layout-star-right',
    x: 79,
    y: 35,
    rotation: 11,
    scale: 0.78,
  },
];

function findBuilderPiece(id: string) {
  const piece = builderPieces.find((item) => item.id === id);

  if (!piece) {
    throw new Error(`Missing builder piece: ${id}`);
  }

  return piece;
}
