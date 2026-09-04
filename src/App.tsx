import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { submitBookingRequest } from './api/bookingRequests';
import {
  addOns,
  availabilityRules,
  bookingSteps,
  faqs,
  galleryItems,
  heroImage,
  initialBookingForm,
  navItems,
  occasions,
  packages,
  setupWindows,
} from './data/siteContent';
import { BuilderPage } from './pages/BuilderPage';
import { clearSavedBuilderLayout, getSavedBuilderLayout } from './lib/builderLayoutStorage';
import { AdminDashboard } from './pages/AdminDashboard';
import type {
  BookingErrors,
  BookingFormState,
  BookingRequestPayload,
  BookingSubmissionResponse,
  BuilderBookingLayout,
} from './types/business';

type PublicPath = '/' | '/occasions' | '/gallery' | '/pricing' | '/builder' | '/booking' | '/faq';

const publicPaths = new Set<PublicPath>([
  '/',
  '/occasions',
  '/gallery',
  '/pricing',
  '/builder',
  '/booking',
  '/faq',
]);
const siteUrl = 'https://fyf.com';
const socialImagePath = '/images/hero-birthday-display.png';

const publicPageMetadata: Record<PublicPath, PageMetadataDefinition> = {
  '/': {
    title: 'Front Yard Famous | Modern Yard Greetings',
    description:
      'Stylish yard sign setups for birthdays, new babies, graduations, anniversaries, retirements, and custom celebrations.',
    path: '/',
  },
  '/occasions': {
    title: 'Occasions | Front Yard Famous',
    description:
      'Browse Front Yard Famous yard greeting options for birthdays, new babies, graduations, anniversaries, retirements, and custom celebrations.',
    path: '/occasions',
  },
  '/gallery': {
    title: 'Gallery | Front Yard Famous',
    description:
      'Explore modern yard sign display ideas, milestone numbers, storks, graduation setups, and celebration themes from Front Yard Famous.',
    path: '/gallery',
  },
  '/pricing': {
    title: 'Pricing | Front Yard Famous',
    description:
      'Review simple starting packages and custom yard sign setup options from Front Yard Famous.',
    path: '/pricing',
  },
  '/builder': {
    title: 'Yard Display Builder | Front Yard Famous',
    description:
      'Prototype a Front Yard Famous yard display by arranging sample letters, numbers, icons, and fillers on a yard canvas.',
    path: '/builder',
  },
  '/booking': {
    title: 'Request a Date | Front Yard Famous',
    description:
      'Request a Front Yard Famous yard sign setup date and share celebration details for manual availability review.',
    path: '/booking',
  },
  '/faq': {
    title: 'FAQ and Service Area | Front Yard Famous',
    description:
      'Find answers about Front Yard Famous setup timing, booking confirmation, service area review, weather, and custom yard greeting requests.',
    path: '/faq',
  },
};

const adminPageMetadata: PageMetadataDefinition = {
  title: 'Admin | Front Yard Famous',
  description: 'Private Front Yard Famous booking and inventory management area.',
  path: '/admin',
  robots: 'noindex,nofollow',
};

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <>
        <PageMetadata metadata={adminPageMetadata} />
        <AdminDashboard />
      </>
    );
  }

  return <PublicSite />;
}

function PublicSite() {
  const currentPath = getPublicPath(window.location.pathname);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submittedRequest, setSubmittedRequest] = useState<BookingRequestPayload | null>(null);
  const [builderLayout, setBuilderLayout] = useState<BuilderBookingLayout | null>(() =>
    getSavedBuilderLayout(),
  );
  const [submission, setSubmission] = useState<BookingSubmissionState>({
    status: 'idle',
  });
  const today = useMemo(getTodayInputValue, []);

  useEffect(() => {
    if (currentPath === '/booking') {
      setBuilderLayout(getSavedBuilderLayout());
    }
  }, [currentPath]);

  function updateBookingField(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setBookingForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name as keyof BookingFormState]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  }

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBookingForm(bookingForm, today);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedRequest(null);
      setSubmission({ status: 'idle' });
      return;
    }

    setSubmission({ status: 'submitting' });

    try {
      const bookingPayload: BookingRequestPayload = {
        ...bookingForm,
        builderLayout,
      };
      const response = await submitBookingRequest(bookingPayload);
      setSubmittedRequest(bookingPayload);
      clearSavedBuilderLayout();
      setSubmission({ response, status: 'success' });
    } catch (error) {
      setSubmittedRequest(null);
      setSubmission({
        error: error instanceof Error ? error.message : 'The request could not be sent.',
        status: 'error',
      });
    }
  }

  function resetBookingForm() {
    setBookingForm(initialBookingForm);
    setErrors({});
    setSubmittedRequest(null);
    setSubmission({ status: 'idle' });
    clearSavedBuilderLayout();
    setBuilderLayout(null);
  }

  function clearBuilderLayout() {
    clearSavedBuilderLayout();
    setBuilderLayout(null);
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <PageMetadata metadata={publicPageMetadata[currentPath]} />
      <Header currentPath={currentPath} />
      {currentPath === '/' ? <HomePage /> : null}
      {currentPath === '/occasions' ? <OccasionsSection /> : null}
      {currentPath === '/gallery' ? <GallerySection /> : null}
      {currentPath === '/pricing' ? (
        <>
          <PricingSection />
          <BookingPrompt />
        </>
      ) : null}
      {currentPath === '/builder' ? <BuilderPage /> : null}
      {currentPath === '/booking' ? (
        <BookingSection
          builderLayout={builderLayout}
          errors={errors}
          form={bookingForm}
          minDate={today}
          onChange={updateBookingField}
          onClearBuilderLayout={clearBuilderLayout}
          onReset={resetBookingForm}
          onSubmit={handleBookingSubmit}
          submission={submission}
          submittedRequest={submittedRequest}
        />
      ) : null}
      {currentPath === '/faq' ? (
        <>
          <ServiceAreaSection />
          <FaqSection />
          <ContactSection />
        </>
      ) : null}
      <Footer />
    </main>
  );
}

type BookingSubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; response: BookingSubmissionResponse }
  | { status: 'error'; error: string };

type PageMetadataDefinition = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

function PageMetadata({ metadata }: { metadata: PageMetadataDefinition }) {
  useEffect(() => {
    const canonicalUrl = new URL(metadata.path, siteUrl).toString();
    const imageUrl = new URL(socialImagePath, siteUrl).toString();

    document.title = metadata.title;
    setMetaTag('name', 'description', metadata.description);
    setMetaTag('name', 'robots', metadata.robots || 'index,follow');
    setMetaTag('property', 'og:title', metadata.title);
    setMetaTag('property', 'og:description', metadata.description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('name', 'twitter:title', metadata.title);
    setMetaTag('name', 'twitter:description', metadata.description);
    setMetaTag('name', 'twitter:image', imageUrl);
    setCanonicalLink(canonicalUrl);
  }, [metadata]);

  return null;
}

type HeaderProps = {
  currentPath: PublicPath;
};

function Header({ currentPath }: HeaderProps) {
  return (
    <header className="border-b border-ink/10 bg-cream/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <a className="font-display text-2xl font-semibold text-forest" href="/">
          Front Yard Famous
        </a>
        <nav aria-label="Main navigation" className="flex w-full gap-2 overflow-x-auto text-sm font-semibold lg:w-auto lg:items-center lg:gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`border px-3 py-2 transition ${
                currentPath === item.href
                  ? 'border-lawn bg-mint text-lawn'
                  : 'border-ink/10 bg-white text-ink/70 hover:border-lawn hover:text-lawn'
              }`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="bg-forest px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-lawn"
          href="/booking"
        >
          Request a date
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-18">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
          Modern yard greetings
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.02] text-forest sm:text-6xl">
          Make their big day Front Yard Famous.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
          Stylish yard sign setups for birthdays, new babies, graduations,
          anniversaries, retirements, and custom celebrations.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="rounded-full bg-coral px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-forest"
            href="/booking"
          >
            Start a booking request
          </a>
          <a
            className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-lawn hover:text-lawn"
            href="/gallery"
          >
            Browse display ideas
          </a>
        </div>
      </div>

      <figure className="border border-ink/10 bg-white p-3 shadow-soft">
        <img alt={heroImage.alt} className="aspect-[4/3] w-full object-cover" src={heroImage.src} />
      </figure>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <HomeOccasionsPreview />
      <HomeGalleryPreview />
      <HomeBookingBand />
    </>
  );
}

function HomeOccasionsPreview() {
  return (
    <section className="border-y border-ink/10 bg-linen py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
              Occasions
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
              A clear path for every celebration.
            </h2>
          </div>
          <div>
            <p className="max-w-xl leading-7 text-ink/68">
              Customers can start with the moment they are celebrating, then move into
              gallery ideas, pricing, or a focused request form.
            </p>
            <a className="mt-5 inline-block bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lawn" href="/occasions">
              View all occasions
            </a>
          </div>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {occasions.slice(0, 4).map((occasion) => (
            <article key={occasion.slug} className="bg-white p-5">
              <h3 className="font-display text-2xl font-semibold text-forest">
                {occasion.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">{occasion.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeGalleryPreview() {
  return (
    <section className="py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <img
          alt="Birthday yard display concept in front of a home"
          className="aspect-[16/10] w-full border border-ink/10 object-cover"
          src={heroImage.src}
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Gallery
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Show the style first, then the details.
          </h2>
          <p className="mt-5 leading-7 text-ink/68">
            The full gallery can become the visual showroom for real inventory,
            themes, and finished setups as product photos are added.
          </p>
          <a className="mt-6 inline-block bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest" href="/gallery">
            Browse gallery
          </a>
        </div>
      </div>
    </section>
  );
}

function HomeBookingBand() {
  return (
    <section className="bg-forest py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-butter">
            Booking
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
            Ready to check a date?
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/70">
            The request flow stays focused on date, location, occasion, and style notes
            so availability can be confirmed manually.
          </p>
        </div>
        <a className="bg-butter px-6 py-3 text-center text-sm font-semibold text-forest transition hover:bg-white" href="/booking">
          Start request
        </a>
      </div>
    </section>
  );
}

function OccasionsSection() {
  return (
    <section id="occasions" className="border-b border-ink/10 bg-linen py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="Occasions"
          title="Clear options for the moments people already search for."
          text="The site should help customers quickly recognize their occasion, then guide them toward a request without making them sort through a crowded catalog."
          headingLevel="h1"
        />
        <div className="mt-10 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <article key={occasion.slug} className="bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-forest">
                {occasion.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">{occasion.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section id="gallery" className="py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Gallery
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            A visual showroom for real inventory.
          </h1>
          <p className="mt-5 leading-7 text-ink/68">
            As product photos are added, this area can become the main place to browse
            display styles, themes, add-ons, and past setups.
          </p>
          <img
            alt="Birthday yard display concept in front of a home"
            className="mt-8 aspect-[5/3] w-full border border-ink/10 object-cover"
            src={heroImage.src}
          />
        </div>
        <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {galleryItems.map((item) => (
            <article key={item.title} className="bg-white p-6">
              <div className="mb-7 h-2 w-14 bg-coral" />
              <h3 className="font-display text-2xl font-semibold text-forest">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingPrompt() {
  return (
    <section className="py-12">
      <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold text-forest">
            Pricing starts the conversation.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/68">
            Final availability and exact package fit are confirmed after the request is reviewed.
          </p>
        </div>
        <a className="bg-coral px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-forest" href="/booking">
          Request a date
        </a>
      </div>
    </section>
  );
}

function ServiceAreaSection() {
  return (
    <section className="border-b border-ink/10 bg-linen py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Service area
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Local setup coverage, confirmed before booking.
          </h1>
          <p className="mt-5 leading-7 text-ink/68">
            Front Yard Famous can start with a practical service-area review instead of
            promising instant availability across every neighborhood.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3">
          <article className="bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Confirmed manually
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              Every request is checked for date, address, route timing, and inventory fit.
            </p>
          </article>
          <article className="bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Route-aware setup
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              Setup windows stay flexible while the business is building capacity.
            </p>
          </article>
          <article className="bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Clear follow-up
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              Customers receive confirmation before a date is treated as booked.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-forest py-16 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="Pricing"
          title="Simple starting packages with room for custom add-ons."
          text="Prices are placeholders for planning. The structure keeps the page easy to scan while leaving flexibility for delivery zones, inventory, and custom requests."
          headingLevel="h1"
          inverted
        />
        <div className="mt-10 grid gap-px overflow-hidden border border-white/14 bg-white/14 lg:grid-cols-3">
          {packages.map((item) => (
            <article key={item.id} className="bg-forest p-6">
              <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
              <p className="mt-5 text-xl font-semibold text-butter">{item.priceLabel}</p>
              <p className="mt-4 text-sm leading-6 text-white/70">{item.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-white/82">
                {item.includes.map((included) => (
                  <li key={included}>{included}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {addOns.map((addOn) => (
            <span key={addOn.id} className="border border-white/18 px-4 py-2 text-sm text-white/82">
              {addOn.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

type BookingSectionProps = {
  builderLayout: BuilderBookingLayout | null;
  errors: BookingErrors;
  form: BookingFormState;
  minDate: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onClearBuilderLayout: () => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submission: BookingSubmissionState;
  submittedRequest: BookingRequestPayload | null;
};

function BookingSection({
  builderLayout,
  errors,
  form,
  minDate,
  onChange,
  onClearBuilderLayout,
  onReset,
  onSubmit,
  submission,
  submittedRequest,
}: BookingSectionProps) {
  return (
    <section id="booking" className="py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.76fr_1.24fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Booking request
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Request first, confirm manually.
          </h1>
          <p className="mt-5 leading-7 text-ink/68">
            This v1 flow collects the details you need without customer accounts,
            instant checkout, or the risk of double-booking inventory.
          </p>
          <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {bookingSteps.map((step, index) => (
              <li key={step} className="flex gap-4 py-4">
                <span className="text-sm font-semibold text-lawn">{index + 1}</span>
                <span className="text-sm font-semibold text-forest">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {availabilityRules.slice(0, 3).map((rule) => (
              <div key={rule.id} className="py-4">
                <p className="text-sm font-semibold text-forest">{rule.label}</p>
                <p className="mt-1 text-sm leading-6 text-ink/58">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 bg-white p-6 sm:p-8">
          {submittedRequest ? (
            <BookingConfirmation
              request={submittedRequest}
              response={submission.status === 'success' ? submission.response : null}
              onReset={onReset}
            />
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <div className="grid gap-6">
                <div>
                  <h3 className="font-display text-3xl font-semibold text-forest">
                    Tell us about the celebration.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/62">
                    Availability is not guaranteed until the request is reviewed and
                    confirmed.
                  </p>
                </div>

                <BuilderLayoutNotice
                  builderLayout={builderLayout}
                  onClearBuilderLayout={onClearBuilderLayout}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    error={errors.name}
                    label="Your name"
                    name="name"
                    onChange={onChange}
                    placeholder="Your name"
                    required
                    value={form.name}
                  />
                  <Field
                    error={errors.phone}
                    label="Phone"
                    name="phone"
                    onChange={onChange}
                    placeholder="(555) 555-5555"
                    required
                    value={form.phone}
                  />
                </div>

                <Field
                  error={errors.email}
                  label="Email"
                  name="email"
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    error={errors.occasion}
                    label="Occasion"
                    name="occasion"
                    onChange={onChange}
                    options={occasions.map((occasion) => occasion.name)}
                    required
                    value={form.occasion}
                  />
                  <Field
                    error={errors.honoreeName}
                    label="Name on display"
                    name="honoreeName"
                    onChange={onChange}
                    placeholder="Mia, Marcus, Class of 2027..."
                    required
                    value={form.honoreeName}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    error={errors.eventDate}
                    label="Preferred date"
                    min={minDate}
                    name="eventDate"
                    onChange={onChange}
                    required
                    type="date"
                    value={form.eventDate}
                  />
                  <SelectField
                    error={errors.setupWindow}
                    label="Preferred setup window"
                    name="setupWindow"
                    onChange={onChange}
                    options={setupWindows}
                    placeholder="Choose a window"
                    required
                    value={form.setupWindow}
                  />
                </div>

                <Field
                  error={errors.serviceArea}
                  label="Setup address or neighborhood"
                  name="serviceArea"
                  onChange={onChange}
                  placeholder="Neighborhood or full address"
                  required
                  value={form.serviceArea}
                />

                <TextareaField
                  error={errors.displayMessage}
                  label="Display message"
                  name="displayMessage"
                  onChange={onChange}
                  placeholder="Happy 40th Marcus, Welcome Home Baby Noah, Congrats Ava..."
                  required
                  value={form.displayMessage}
                />

                <TextareaField
                  label="Colors, theme, or notes"
                  name="themeNotes"
                  onChange={onChange}
                  placeholder="Favorite colors, school colors, interests, theme ideas, or anything to avoid."
                  value={form.themeNotes}
                />

                <div className="flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm leading-6 text-ink/58">
                    <p>
                      No payment is collected here. You will receive a confirmation before
                      the booking is official.
                    </p>
                    {submission.status === 'error' ? (
                      <p className="mt-2 font-semibold text-coral">{submission.error}</p>
                    ) : null}
                  </div>
                  <button
                    className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:bg-ink/30"
                    disabled={submission.status === 'submitting'}
                    type="submit"
                  >
                    {submission.status === 'submitting' ? 'Sending request...' : 'Send request'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function BuilderLayoutNotice({
  builderLayout,
  onClearBuilderLayout,
}: {
  builderLayout: BuilderBookingLayout | null;
  onClearBuilderLayout: () => void;
}) {
  if (!builderLayout) {
    return (
      <div className="border border-ink/10 bg-cream p-5">
        <p className="text-sm font-semibold text-lawn">Optional builder concept</p>
        <p className="mt-2 text-sm leading-6 text-ink/62">
          Want to sketch the display first? Use the builder, then return here with the
          layout attached to this request.
        </p>
        <a
          className="mt-4 inline-block bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-lawn"
          href="/builder"
        >
          Open builder
        </a>
      </div>
    );
  }

  return (
    <div className="border border-lawn/20 bg-mint p-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-sm font-semibold text-lawn">Builder concept attached</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-forest">
            {builderLayout.summary}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            This layout will be saved with the booking request for admin review.
          </p>
        </div>
        <div className="flex gap-2 sm:justify-end">
          <a
            className="border border-ink/12 bg-white px-3 py-2 text-sm font-semibold text-ink/72 transition hover:border-lawn hover:text-lawn"
            href="/builder"
          >
            Edit
          </a>
          <button
            className="border border-coral/25 bg-white px-3 py-2 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
            onClick={onClearBuilderLayout}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {builderLayout.pieces.slice(0, 8).map((piece) => (
          <span key={piece.instanceId} className="border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold text-ink/62">
            {piece.label}
          </span>
        ))}
      </div>
    </div>
  );
}
type BookingConfirmationProps = {
  request: BookingRequestPayload;
  response: BookingSubmissionResponse | null;
  onReset: () => void;
};

function BookingConfirmation({ request, response, onReset }: BookingConfirmationProps) {
  const summary = [
    ['Request ID', response?.id || 'Pending'],
    ['Occasion', request.occasion],
    ['Display name', request.honoreeName],
    ['Preferred date', formatDate(request.eventDate)],
    ['Setup window', request.setupWindow],
    ['Location', request.serviceArea],
    ['Message', request.displayMessage],
    ['Theme notes', request.themeNotes || 'No notes added'],
    ...(request.builderLayout ? [['Builder layout', request.builderLayout.summary]] : []),
  ];

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
        Request ready for review
      </p>
      <h3 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
        Thanks, {request.name}. Here is the request summary.
      </h3>
      <p className="mt-4 leading-7 text-ink/68">
        Your request has been saved for manual availability review. The booking is not
        official until the date, location, and inventory are confirmed.
      </p>

      <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {summary.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-4 sm:grid-cols-[0.32fr_0.68fr]">
            <dt className="text-sm font-semibold text-lawn">{label}</dt>
            <dd className="text-sm leading-6 text-ink/75">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-lawn"
          onClick={onReset}
          type="button"
        >
          Start another request
        </button>
        <a
          className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-lawn hover:text-lawn"
          href="#booking"
        >
          Keep reviewing
        </a>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="border-y border-ink/10 bg-linen py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="FAQ and policies"
          title="Answer the practical questions before they become texts."
          text="These are starter policy areas. We can refine the exact wording once service radius, weather rules, and cancellation preferences are firm."
        />
        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq) => (
            <article key={faq.question} className="grid gap-3 py-6 md:grid-cols-[0.38fr_0.62fr]">
              <h3 className="font-display text-2xl font-semibold text-forest">
                {faq.question}
              </h3>
              <p className="leading-7 text-ink/68">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Contact
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Ready when the first real booking details are.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-ink/68">
            Next we can connect the request flow to email, a form provider, or a
            lightweight API depending on how hands-on you want the launch version to be.
          </p>
        </div>
        <a
          className="rounded-full bg-forest px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-lawn"
          href="mailto:hello@frontyardfamous.com?subject=Front%20Yard%20Famous%20booking%20request"
        >
          Email placeholder
        </a>
      </div>
    </section>
  );
}

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  text: string;
  headingLevel?: 'h1' | 'h2';
  inverted?: boolean;
};

function SectionIntro({
  eyebrow,
  title,
  text,
  headingLevel = 'h2',
  inverted = false,
}: SectionIntroProps) {
  const Heading = headingLevel;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-[0.18em] ${
            inverted ? 'text-butter' : 'text-lawn'
          }`}
        >
          {eyebrow}
        </p>
        <Heading
          className={`mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight ${
            inverted ? 'text-white' : 'text-forest'
          }`}
        >
          {title}
        </Heading>
      </div>
      <p className={`max-w-xl leading-7 ${inverted ? 'text-white/70' : 'text-ink/68'}`}>
        {text}
      </p>
    </div>
  );
}

type FieldProps = {
  error?: string;
  label: string;
  min?: string;
  name: keyof BookingFormState;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

function Field({
  error,
  label,
  min,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-semibold text-forest">
      {label}
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 border border-ink/12 bg-cream px-3 text-sm font-normal text-ink outline-none transition focus:border-lawn"
        min={min}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error ? (
        <span className="text-sm font-medium text-coral" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  error?: string;
  label: string;
  name: keyof BookingFormState;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  value: string;
};

function SelectField({
  error,
  label,
  name,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: SelectFieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-semibold text-forest">
      {label}
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 border border-ink/12 bg-cream px-3 text-sm font-normal text-ink outline-none transition focus:border-lawn"
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-sm font-medium text-coral" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

type TextareaFieldProps = {
  error?: string;
  label: string;
  name: keyof BookingFormState;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
};

function TextareaField({
  error,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  value,
}: TextareaFieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-semibold text-forest">
      {label}
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="min-h-28 resize-y border border-ink/12 bg-cream px-3 py-3 text-sm font-normal text-ink outline-none transition focus:border-lawn"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        value={value}
      />
      {error ? (
        <span className="text-sm font-medium text-coral" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink/62 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-forest">Front Yard Famous</p>
        <p>Yard greetings, storks, milestone numbers, and custom celebration displays.</p>
      </div>
    </footer>
  );
}

function validateBookingForm(form: BookingFormState, today: string) {
  const nextErrors: BookingErrors = {};
  const phoneDigits = form.phone.replace(/\D/g, '');

  if (form.name.trim().length < 2) {
    nextErrors.name = 'Enter your name.';
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    nextErrors.email = 'Enter a valid email address.';
  }

  if (phoneDigits.length < 10) {
    nextErrors.phone = 'Enter a phone number with area code.';
  }

  if (!form.occasion) {
    nextErrors.occasion = 'Choose an occasion.';
  }

  if (!form.eventDate) {
    nextErrors.eventDate = 'Choose a preferred date.';
  } else if (form.eventDate < today) {
    nextErrors.eventDate = 'Choose today or a future date.';
  }

  if (!form.setupWindow) {
    nextErrors.setupWindow = 'Choose a setup window.';
  }

  if (form.serviceArea.trim().length < 5) {
    nextErrors.serviceArea = 'Enter a neighborhood or address.';
  }

  if (form.honoreeName.trim().length < 1) {
    nextErrors.honoreeName = 'Enter the name or phrase for the display.';
  }

  if (form.displayMessage.trim().length < 3) {
    nextErrors.displayMessage = 'Enter the main display message.';
  }

  return nextErrors;
}

function getTodayInputValue() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(value: string) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function getPublicPath(pathname: string): PublicPath {
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  if (publicPaths.has(normalizedPath as PublicPath)) {
    return normalizedPath as PublicPath;
  }

  return '/';
}

export default App;
