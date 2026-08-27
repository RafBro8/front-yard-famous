import { FormEvent, useState } from 'react';

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

const bookingSteps = [
  'Customer submits the request',
  'You check date, route, and inventory',
  'You confirm the setup details',
  'Payment can be added later',
];

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Header />
      <Hero />
      <OccasionsSection />
      <GallerySection />
      <PricingSection />
      <BookingSection isSubmitted={isSubmitted} onSubmit={handleBookingSubmit} />
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
  isSubmitted: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function BookingSection({ isSubmitted, onSubmit }: BookingSectionProps) {
  return (
    <section id="booking" className="py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Booking request
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
            Request first, confirm manually.
          </h2>
          <p className="mt-5 leading-7 text-ink/68">
            This v1 flow avoids customer accounts and instant checkout while still
            giving you the important details: date, location, occasion, and style.
          </p>
          <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {bookingSteps.map((step, index) => (
              <li key={step} className="flex gap-4 py-4">
                <span className="text-sm font-semibold text-lawn">{index + 1}</span>
                <span className="text-sm font-semibold text-forest">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <form className="border border-ink/10 bg-white p-6 sm:p-8" onSubmit={onSubmit}>
          {isSubmitted ? (
            <div className="grid min-h-96 place-items-center text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
                  Request drafted
                </p>
                <h3 className="mt-4 font-display text-4xl font-semibold text-forest">
                  Booking form behavior is ready for backend wiring.
                </h3>
                <p className="mt-5 leading-7 text-ink/68">
                  In Stage 3, this can submit to an API, email service, or form provider.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder="Your name" />
                <Field label="Phone" name="phone" placeholder="(555) 555-5555" />
              </div>
              <Field label="Email" name="email" placeholder="you@example.com" type="email" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred date" name="date" type="date" />
                <label className="grid gap-2 text-sm font-semibold text-forest">
                  Occasion
                  <select
                    className="h-12 border border-ink/12 bg-cream px-3 text-sm font-normal text-ink outline-none focus:border-lawn"
                    name="occasion"
                  >
                    {occasions.map((occasion) => (
                      <option key={occasion.name}>{occasion.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <Field label="Setup address or area" name="address" placeholder="Neighborhood or full address" />
              <label className="grid gap-2 text-sm font-semibold text-forest">
                Colors, theme, or notes
                <textarea
                  className="min-h-28 resize-y border border-ink/12 bg-cream px-3 py-3 text-sm font-normal text-ink outline-none focus:border-lawn"
                  name="notes"
                  placeholder="Tell us the name, age, colors, theme, and anything special."
                />
              </label>
              <button
                className="mt-2 rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest"
                type="submit"
              >
                Preview request flow
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
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
            Next we can connect this to email, a form provider, or a lightweight API
            depending on how hands-on you want the launch version to be.
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
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
};

function Field({ label, name, placeholder, type = 'text' }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-forest">
      {label}
      <input
        className="h-12 border border-ink/12 bg-cream px-3 text-sm font-normal text-ink outline-none focus:border-lawn"
        name={name}
        placeholder={placeholder}
        type={type}
      />
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

export default App;
