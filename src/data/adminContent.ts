import type { BlackoutDate } from '../types/business';

export const blackoutDates: BlackoutDate[] = [
  {
    id: 'labor-day-weekend',
    date: '2026-09-06',
    label: 'Labor Day weekend',
    reason: 'Keep closed until setup capacity is known.',
  },
  {
    id: 'inventory-day',
    date: '2026-09-26',
    label: 'Inventory reset',
    reason: 'Reserve time for cleaning, repairs, and photo updates.',
  },
];
