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

export type BookingStatus = 'new' | 'reviewing' | 'confirmed' | 'declined' | 'completed';

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

export type BookingSubmissionResponse = {
  id: string;
  status: BookingStatus;
  receivedAt: string;
  message: string;
};

export type BookingRecord = BookingFormState & {
  id: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type InventoryAvailabilityItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  status: InventoryStatus;
  quantity: number;
  reserved: number;
};

export type PackageCatalogItem = Pick<PackageTier, 'id' | 'name' | 'priceLabel'>;

export type AdminDashboardData = {
  bookings: BookingRecord[];
  inventory: InventoryAvailabilityItem[];
  packages: PackageCatalogItem[];
};

export type BuilderPieceCategory =
  | 'letter'
  | 'number'
  | 'theme'
  | 'baby'
  | 'graduation'
  | 'filler';

export type BuilderPieceShape = 'rectangle' | 'circle' | 'star' | 'stork' | 'cap';

export type BuilderPieceTemplate = {
  id: string;
  label: string;
  category: BuilderPieceCategory;
  color: string;
  textColor: string;
  shape: BuilderPieceShape;
};

export type BuilderCanvasPiece = BuilderPieceTemplate & {
  instanceId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
};

export type AdminBookingRequest = {
  id: string;
  status: BookingStatus;
  customerName: string;
  contact: string;
  occasion: string;
  eventDate: string;
  setupWindow: string;
  serviceArea: string;
  displayMessage: string;
  packageId: string;
  estimateLabel: string;
  submittedAt: string;
  inventoryNeeds: string[];
  routeNotes: string;
};

export type BlackoutDate = {
  id: string;
  date: string;
  label: string;
  reason: string;
};
