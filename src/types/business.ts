export type OccasionSlug =
  | 'birthdays'
  | 'new-baby'
  | 'graduation'
  | 'anniversary'
  | 'retirement'
  | 'custom';

export type InventoryCategory =
  | 'letters'
  | 'numbers'
  | 'theme-icons'
  | 'baby'
  | 'graduation'
  | 'fillers'
  | 'hardware';

export type InventoryStatus = 'planned' | 'priority' | 'owned';

export type NavItem = {
  label: string;
  href: string;
};

export type OccasionCategory = {
  slug: OccasionSlug;
  name: string;
  description: string;
  packageIds: string[];
  inventoryTags: string[];
};

export type GalleryItem = {
  title: string;
  description: string;
  occasion: OccasionSlug;
  inventoryTags: string[];
};

export type PackageTier = {
  id: string;
  name: string;
  priceLabel: string;
  startingPriceCents: number;
  description: string;
  includes: string[];
  bestFor: OccasionSlug[];
  upgradeOptionIds: string[];
};

export type AddOnOption = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  inventoryTags: string[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  status: InventoryStatus;
  quantity: number;
  occasions: OccasionSlug[];
  tags: string[];
  notes: string;
};

export type AvailabilityRule = {
  id: string;
  label: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  eventDate: string;
  setupWindow: string;
  serviceArea: string;
  honoreeName: string;
  displayMessage: string;
  themeNotes: string;
};

export type BookingErrors = Partial<Record<keyof BookingFormState, string>>;
