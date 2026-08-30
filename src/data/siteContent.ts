import type {
  AddOnOption,
  AvailabilityRule,
  BookingFormState,
  FaqItem,
  GalleryItem,
  InventoryItem,
  NavItem,
  OccasionCategory,
  PackageTier,
} from '../types/business';

export const heroImage = {
  src: '/images/hero-birthday-display.png',
  alt: 'Premium happy birthday yard display with large letters, milestone numbers, and graphic accents',
};

export const navItems: NavItem[] = [
  { label: 'Occasions', href: '/occasions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Booking', href: '/booking' },
  { label: 'FAQ', href: '/faq' },
];

export const occasions: OccasionCategory[] = [
  {
    slug: 'birthdays',
    name: 'Birthdays',
    description: 'Names, ages, favorite colors, themed accents, and big milestone numbers.',
    packageIds: ['classic-greeting', 'milestone-display'],
    inventoryTags: ['letters', 'numbers', 'birthday-icons', 'fillers'],
  },
  {
    slug: 'new-baby',
    name: 'New baby',
    description: 'Storks, soft palettes, welcome-home announcements, and sibling notes.',
    packageIds: ['baby-welcome'],
    inventoryTags: ['stork', 'baby-icons', 'letters', 'fillers'],
  },
  {
    slug: 'graduation',
    name: 'Graduation',
    description: 'School colors, class years, activities, sports, and senior sendoffs.',
    packageIds: ['classic-greeting', 'milestone-display'],
    inventoryTags: ['letters', 'numbers', 'graduation-icons', 'school-colors'],
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    description: 'Elegant displays for big years, vow renewals, and surprise celebrations.',
    packageIds: ['classic-greeting', 'milestone-display'],
    inventoryTags: ['letters', 'numbers', 'elegant-fillers'],
  },
  {
    slug: 'retirement',
    name: 'Retirement',
    description: 'Career nods, hobbies, farewell messages, and polished sendoff styling.',
    packageIds: ['classic-greeting'],
    inventoryTags: ['letters', 'hobby-icons', 'fillers'],
  },
  {
    slug: 'custom',
    name: 'Custom',
    description: 'Welcome home, team wins, holidays, first days, and just-because moments.',
    packageIds: ['classic-greeting'],
    inventoryTags: ['letters', 'fillers', 'custom-icons'],
  },
];

export const galleryItems: GalleryItem[] = [
  {
    title: 'Birthday statement',
    description: 'Large greeting letters, name, age, and themed icons.',
    occasion: 'birthdays',
    inventoryTags: ['letters', 'numbers', 'birthday-icons'],
  },
  {
    title: 'Milestone numbers',
    description: 'Oversized numbers styled with stars, icons, and premium fillers.',
    occasion: 'birthdays',
    inventoryTags: ['numbers', 'stars', 'premium-fillers'],
  },
  {
    title: 'Baby welcome',
    description: 'Stork display, birth detail panel, and soft decorative pieces.',
    occasion: 'new-baby',
    inventoryTags: ['stork', 'baby-icons', 'letters'],
  },
  {
    title: 'Graduation yard',
    description: 'School-color setup with class year, name, and achievement accents.',
    occasion: 'graduation',
    inventoryTags: ['numbers', 'graduation-icons', 'school-colors'],
  },
];

export const packages: PackageTier[] = [
  {
    id: 'classic-greeting',
    name: 'Classic Greeting',
    priceLabel: 'from $95',
    startingPriceCents: 9500,
    description: 'A clean name-and-message display for birthdays and everyday celebrations.',
    includes: ['Up to 24-hour rental', 'Standard letters and fillers', 'Setup and pickup'],
    bestFor: ['birthdays', 'anniversary', 'retirement', 'custom'],
    upgradeOptionIds: ['extra-name-line', 'theme-icons', 'premium-fillers'],
  },
  {
    id: 'milestone-display',
    name: 'Milestone Display',
    priceLabel: 'from $125',
    startingPriceCents: 12500,
    description: 'A larger display with premium visual impact for big birthdays and graduations.',
    includes: ['Large numbers or class year', 'Expanded color story', 'Extra accent pieces'],
    bestFor: ['birthdays', 'graduation', 'anniversary'],
    upgradeOptionIds: ['oversized-numbers', 'theme-icons', 'premium-fillers'],
  },
  {
    id: 'baby-welcome',
    name: 'Baby Welcome',
    priceLabel: 'from $145',
    startingPriceCents: 14500,
    description: 'A sweet new-baby setup with stork or announcement styling.',
    includes: ['Stork or baby theme', 'Custom name/details', 'Soft coordinating fillers'],
    bestFor: ['new-baby'],
    upgradeOptionIds: ['extra-name-line', 'premium-fillers'],
  },
];

export const addOns: AddOnOption[] = [
  {
    id: 'extra-name-line',
    name: 'Extra name line',
    description: 'Adds an additional name, sibling name, or short message line.',
    priceLabel: 'quote',
    inventoryTags: ['letters'],
  },
  {
    id: 'oversized-numbers',
    name: 'Oversized numbers',
    description: 'Large age, year, or anniversary numbers for a stronger focal point.',
    priceLabel: 'quote',
    inventoryTags: ['numbers'],
  },
  {
    id: 'theme-icons',
    name: 'Theme icons',
    description: 'Cake, stars, graduation, baby, hobby, or other themed sign pieces.',
    priceLabel: 'quote',
    inventoryTags: ['theme-icons'],
  },
  {
    id: 'premium-fillers',
    name: 'Premium filler signs',
    description: 'Coordinating stars, shapes, and accent pieces that complete the display.',
    priceLabel: 'quote',
    inventoryTags: ['fillers'],
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: 'modern-letter-set',
    name: 'Modern letter set',
    category: 'letters',
    status: 'priority',
    quantity: 1,
    occasions: ['birthdays', 'new-baby', 'graduation', 'anniversary', 'retirement', 'custom'],
    tags: ['letters', 'names', 'messages'],
    notes: 'Core reusable alphabet inventory for names and display messages.',
  },
  {
    id: 'oversized-number-set',
    name: 'Oversized number set',
    category: 'numbers',
    status: 'priority',
    quantity: 1,
    occasions: ['birthdays', 'graduation', 'anniversary'],
    tags: ['numbers', 'milestones', 'class-years'],
    notes: 'High-impact age, anniversary, and graduation year pieces.',
  },
  {
    id: 'birthday-icon-kit',
    name: 'Birthday icon kit',
    category: 'theme-icons',
    status: 'planned',
    quantity: 1,
    occasions: ['birthdays'],
    tags: ['birthday-icons', 'cake', 'stars', 'celebration'],
    notes: 'Reusable birthday graphics that work across kids and adult displays.',
  },
  {
    id: 'baby-stork-kit',
    name: 'Baby stork kit',
    category: 'baby',
    status: 'planned',
    quantity: 1,
    occasions: ['new-baby'],
    tags: ['stork', 'baby-icons', 'announcement'],
    notes: 'Dedicated new-baby display inventory for premium welcome-home setups.',
  },
  {
    id: 'graduation-icon-kit',
    name: 'Graduation icon kit',
    category: 'graduation',
    status: 'planned',
    quantity: 1,
    occasions: ['graduation'],
    tags: ['graduation-icons', 'school-colors', 'class-years'],
    notes: 'Cap, diploma, school-color, activity, and senior celebration accents.',
  },
  {
    id: 'premium-filler-set',
    name: 'Premium filler set',
    category: 'fillers',
    status: 'priority',
    quantity: 1,
    occasions: ['birthdays', 'new-baby', 'graduation', 'anniversary', 'retirement', 'custom'],
    tags: ['fillers', 'stars', 'shapes', 'accents'],
    notes: 'Neutral accent pieces that help every display feel finished.',
  },
  {
    id: 'stakes-and-hardware',
    name: 'Stakes and setup hardware',
    category: 'hardware',
    status: 'priority',
    quantity: 1,
    occasions: ['birthdays', 'new-baby', 'graduation', 'anniversary', 'retirement', 'custom'],
    tags: ['hardware', 'stakes', 'setup'],
    notes: 'Operational inventory needed to install and remove displays safely.',
  },
];

export const availabilityRules: AvailabilityRule[] = [
  {
    id: 'manual-confirmation',
    label: 'Manual confirmation',
    description: 'Every request is reviewed before the date is considered booked.',
  },
  {
    id: 'inventory-check',
    label: 'Inventory check',
    description: 'Package and add-on choices depend on available pieces for that date.',
  },
  {
    id: 'route-review',
    label: 'Route review',
    description: 'Setup timing depends on location, service area, and daily route planning.',
  },
  {
    id: 'future-blackout-dates',
    label: 'Blackout dates later',
    description: 'Unavailable dates can become a backend/admin feature when needed.',
  },
];

export const faqs: FaqItem[] = [
  {
    question: 'Do customers need an account?',
    answer:
      'Not for the first version. A simple request form keeps booking easy while you confirm availability manually.',
  },
  {
    question: 'When is the display installed?',
    answer:
      'Most setups can be installed the evening before or morning of the celebration, depending on route and availability.',
  },
  {
    question: 'What happens after a request is submitted?',
    answer:
      'You review the date, address, occasion, inventory needs, and setup timing before confirming the booking.',
  },
  {
    question: 'Can customers request custom themes?',
    answer:
      'Yes. The form collects colors, themes, names, and notes so custom ideas can be reviewed before confirmation.',
  },
];

export const setupWindows = [
  'Evening before',
  'Morning of event',
  'Afternoon of event',
  'Flexible',
];

export const bookingSteps = [
  'Customer submits the request',
  'You check date, route, and inventory',
  'You confirm the setup details',
  'Payment can be added later',
];

export const initialBookingForm: BookingFormState = {
  name: '',
  email: '',
  phone: '',
  occasion: occasions[0].name,
  eventDate: '',
  setupWindow: '',
  serviceArea: '',
  honoreeName: '',
  displayMessage: '',
  themeNotes: '',
};
