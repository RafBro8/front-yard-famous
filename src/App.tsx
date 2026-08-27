const occasions = [
  'Birthdays',
  'New baby',
  'Graduation',
  'Anniversary',
  'Retirement',
  'Custom celebrations',
];

const services = [
  {
    title: 'Yard greetings',
    text: 'Names, ages, themes, and coordinated accents for birthdays and milestone moments.',
  },
  {
    title: 'Baby announcements',
    text: 'Storks, soft color palettes, birth details, and welcome-home setups.',
  },
  {
    title: 'Premium add-ons',
    text: 'Large numbers, balloons, specialty pieces, and custom styling as inventory grows.',
  },
];

const packages = [
  ['Classic Greeting', 'from $95'],
  ['Milestone Display', 'from $125'],
  ['Baby Welcome', 'from $145'],
];

const bookingSteps = [
  'Tell us the occasion',
  'Choose your preferred date',
  'Share the location and style notes',
  'We confirm availability before payment',
];

function App() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/10 bg-cream/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a className="font-display text-2xl font-semibold text-forest" href="/">
            Front Yard Famous
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a className="hover:text-lawn" href="#occasions">
              Occasions
            </a>
            <a className="hover:text-lawn" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-lawn" href="#booking">
              Booking
            </a>
          </nav>
          <a
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lawn"
            href="#booking"
          >
            Request a date
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
            Modern celebration displays
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.02] text-forest sm:text-6xl">
            Make their big day Front Yard Famous.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
            Stylish yard greetings, storks, milestone numbers, and custom setups for
            celebrations that deserve a little front-yard spotlight.
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
              href="#pricing"
            >
              View starting prices
            </a>
          </div>
        </div>

        <figure className="border border-ink/10 bg-white p-3 shadow-soft">
          <img
            alt="Premium happy birthday yard display with large letters, milestone numbers, balloons, and graphic accents"
            className="aspect-[4/3] w-full object-cover"
            src="/images/hero-birthday-display.png"
          />
          <figcaption className="px-2 py-4 text-sm leading-6 text-ink/62">
            Final product photos will replace this concept image as inventory is built.
          </figcaption>
        </figure>
      </section>

      <section id="occasions" className="border-y border-ink/10 bg-linen py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
              Occasions
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
              Easy to browse, easy to book.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {occasions.map((occasion) => (
              <div key={occasion} className="bg-white px-5 py-4">
                <p className="font-semibold text-forest">{occasion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
              What you offer
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
              A polished display service, not a cluttered sign catalog.
            </h2>
          </div>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {services.map((service) => (
              <article key={service.title} className="grid gap-3 py-6 sm:grid-cols-[0.35fr_0.65fr]">
                <h3 className="font-display text-2xl font-semibold text-forest">
                  {service.title}
                </h3>
                <p className="leading-7 text-ink/68">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-forest py-16 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-butter">
                Starting prices
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
                Simple packages, personalized after the request.
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden border border-white/14 bg-white/14 md:grid-cols-3">
              {packages.map(([name, price]) => (
                <article key={name} className="bg-forest px-5 py-6">
                  <h3 className="font-display text-2xl font-semibold">{name}</h3>
                  <p className="mt-5 text-lg font-semibold text-butter">{price}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="booking" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lawn">
              Booking
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-forest">
              Keep v1 simple: request first, confirm manually.
            </h2>
            <p className="mt-5 leading-7 text-ink/68">
              This avoids customer login, instant payments, and double-booking while the
              business model is still being shaped.
            </p>
          </div>
          <ol className="divide-y divide-ink/10 border-y border-ink/10">
            {bookingSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-5 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-sm font-semibold text-lawn">
                  {index + 1}
                </span>
                <span className="font-semibold text-forest">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-linen">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink/62 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-forest">Front Yard Famous</p>
          <p>Yard greetings, storks, milestone numbers, and custom celebration displays.</p>
        </div>
      </footer>
    </main>
  );
}

export default App;
