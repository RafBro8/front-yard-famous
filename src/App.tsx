import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

type BookingFormState = {
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

type BookingErrors = Partial<Record<keyof BookingFormState, string>>;

const initialBookingForm: BookingFormState = {
  name: '',
  email: '',
  phone: '',
  occasion: 'Birthdays',
  eventDate: '',
  setupWindow: '',
  serviceArea: '',
  honoreeName: '',
  displayMessage: '',
  themeNotes: '',
};

const navItems = [
  ['Occasions', '#occasions'],
  ['Gallery', '#gallery'],
  ['Pricing', '#pricing'],
  ['Booking', '#booking'],
  ['FAQ', '#faq'],
];

const occasions = [
  {
    name: 'Birthdays',
    description: 'Names, ages, favorite colors, themed accents, and big milestone numbers.',
  },
  {
    name: 'New baby',
    description: 'Storks, soft palettes, welcome-home announcements, and sibling notes.',
  },
  {
    name: 'Graduation',
    description: 'School colors, class years, activities, sports, and senior sendoffs.',
  },
  {
    name: 'Anniversary',
    description: 'Elegant displays for big years, vow renewals, and surprise celebrations.',
  },
  {
    name: 'Retirement',
    description: 'Career nods, hobbies, farewell messages, and polished sendoff styling.',
  },
  {
    name: 'Custom',
    description: 'Welcome home, team wins, holidays, first days, and just-because moments.',
  },
];

const galleryItems = [
  ['Birthday statement', 'Large greeting letters, name, age, and themed icons.'],
  ['Milestone numbers', 'Oversized numbers styled with stars, icons, and premium fillers.'],
  ['Baby welcome', 'Stork display, birth detail panel, and soft decorative pieces.'],
  ['Graduation yard', 'School-color setup with class year, name, and achievement accents.'],
];

const packages = [
  {
    name: 'Classic Greeting',
    price: 'from $95',
    description: 'A clean name-and-message display for birthdays and everyday celebrations.',
    includes: ['Up to 24-hour rental', 'Standard letters and fillers', 'Setup and pickup'],
  },
  {
    name: 'Milestone Display',
    price: 'from $125',
    description: 'A larger display with premium visual impact for big birthdays and graduations.',
    includes: ['Large numbers or class year', 'Expanded color story', 'Extra accent pieces'],
  },
  {
    name: 'Baby Welcome',
    price: 'from $145',
    description: 'A sweet new-baby setup with stork or announcement styling.',
    includes: ['Stork or baby theme', 'Custom name/details', 'Soft coordinating fillers'],
  },
];

const addOns = ['Extra name line', 'Oversized numbers', 'Theme icons', 'Premium filler signs'];

const faqs = [
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

const setupWindows = [
  'Evening before',
  'Morning of event',
  'Afternoon of event',
  'Flexible',
];

const bookingSteps = [
  'Customer submits the request',
  'You check date, route, and inventory',
  'You confirm the setup details',
  'Payment can be added later',
];

function App() {
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submittedRequest, setSubmittedRequest] = useState<BookingFormState | null>(null);
  const today = useMemo(getTodayInputValue, []);

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

  function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBookingForm(bookingForm, today);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedRequest(null);
      return;
    }

    setSubmittedRequest(bookingForm);
  }

  function resetBookingForm() {
    setBookingForm(initialBookingForm);
    setErrors({});
    setSubmittedRequest(null);
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Header />
      <Hero />
      <OccasionsSection />
      <GallerySection />
      <PricingSection />
      <BookingSection
        errors={errors}
        form={bookingForm}
        minDate={today}
        onChange={updateBookingField}
        onReset={resetBookingForm}
        onSubmit={handleBookingSubmit}
        submittedRequest={submittedRequest}
      />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
        <a className="font-display text-2xl font-semibold text-forest" href="/">
          Front Yard Famous
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} className="transition hover:text-lawn" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lawn"
          href="#booking"
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
            href="#booking"
          >
            Start a booking request
          </a>
          <a
            className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-lawn hover:text-lawn"
            href="#gallery"
          >
            Browse display ideas
          </a>
        </div>
      </div>

      <figure className="border border-ink/10 bg-white p-3 shadow-soft">
        <img
          alt="Premium happy birthday yard display with large letters, milestone numbers, and graphic accents"
          className="aspect-[4/3] w-full object-cover"
          src="/images/hero-birthday-display.png"
        />
      </figure>
    </section>
  );
}

function OccasionsSection() {
  return (
    <section id="occasions" className="border-y border-ink/10 bg-linen py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="Occasions"
          title="Clear options for the moments people already search for."
          text="The site should help customers quickly recognize their occasion, then guide them toward a request without making them sort through a crowded catalog."
        />
        <div className="mt-10 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <article key={occasion.name} className="bg-white p-6">
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
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            A visual showroom for real inventory.
          </h2>
          <p className="mt-5 leading-7 text-ink/68">
            As product photos are added, this area can become the main place to browse
            display styles, themes, add-ons, and past setups.
          </p>
          <img
            alt="Birthday yard display concept in front of a home"
            className="mt-8 aspect-[5/3] w-full border border-ink/10 object-cover"
            src="/images/hero-birthday-display.png"
          />
        </div>
        <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {galleryItems.map(([title, text]) => (
            <article key={title} className="bg-white p-6">
              <div className="mb-7 h-2 w-14 bg-coral" />
              <h3 className="font-display text-2xl font-semibold text-forest">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">{text}</p>
            </article>
          ))}
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
          inverted
        />
        <div className="mt-10 grid gap-px overflow-hidden border border-white/14 bg-white/14 lg:grid-cols-3">
          {packages.map((item) => (
            <article key={item.name} className="bg-forest p-6">
              <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
              <p className="mt-5 text-xl font-semibold text-butter">{item.price}</p>
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
            <span key={addOn} className="border border-white/18 px-4 py-2 text-sm text-white/82">
              {addOn}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

type BookingSectionProps = {
  errors: BookingErrors;
  form: BookingFormState;
  minDate: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submittedRequest: BookingFormState | null;
};

function BookingSection({
  errors,
  form,
  minDate,
  onChange,
  onReset,
  onSubmit,
  submittedRequest,
}: BookingSectionProps) {
  return (
    <section id="booking" className="py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.76fr_1.24fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Booking request
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Request first, confirm manually.
          </h2>
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
          <p className="mt-6 text-sm leading-6 text-ink/58">
            This form currently drafts the request in the browser only. Stage 4 or 6 can
            connect it to email, an API, or a database.
          </p>
        </div>

        <div className="border border-ink/10 bg-white p-6 sm:p-8">
          {submittedRequest ? (
            <BookingConfirmation request={submittedRequest} onReset={onReset} />
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
                  <p className="text-sm leading-6 text-ink/58">
                    No payment is collected here. You will receive a confirmation before
                    the booking is official.
                  </p>
                  <button
                    className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest"
                    type="submit"
                  >
                    Review request
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

type BookingConfirmationProps = {
  request: BookingFormState;
  onReset: () => void;
};

function BookingConfirmation({ request, onReset }: BookingConfirmationProps) {
  const summary = [
    ['Occasion', request.occasion],
    ['Display name', request.honoreeName],
    ['Preferred date', formatDate(request.eventDate)],
    ['Setup window', request.setupWindow],
    ['Location', request.serviceArea],
    ['Message', request.displayMessage],
    ['Theme notes', request.themeNotes || 'No notes added'],
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
        This confirms the form experience only. The next production step is sending this
        summary to you through email or an API.
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
  inverted?: boolean;
};

function SectionIntro({ eyebrow, title, text, inverted = false }: SectionIntroProps) {
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
        <h2
          className={`mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight ${
            inverted ? 'text-white' : 'text-forest'
          }`}
        >
          {title}
        </h2>
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

export default App;
