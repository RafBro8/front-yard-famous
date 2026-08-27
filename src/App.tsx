const occasions = [
  {
    title: 'Birthdays',
    copy: 'Bold names, milestone numbers, theme colors, and photo-ready yard moments.',
    accent: 'bg-butter',
  },
  {
    title: 'New baby',
    copy: 'Sweet storks, welcome-home announcements, nursery palettes, and sibling add-ons.',
    accent: 'bg-sky',
  },
  {
    title: 'Graduation',
    copy: 'School colors, class years, sports, activities, and porch-to-lawn setups.',
    accent: 'bg-lawn text-white',
  },
  {
    title: 'Anniversary',
    copy: 'Elegant displays for big years, vow renewals, surprise dinners, and family parties.',
    accent: 'bg-blush',
  },
  {
    title: 'Retirement',
    copy: 'A polished sendoff with hobbies, career nods, colors, and optional add-ons.',
    accent: 'bg-lilac',
  },
  {
    title: 'Custom moments',
    copy: 'Welcome home, first day, team wins, holiday surprises, or anything worth shouting.',
    accent: 'bg-mint',
  },
];

const packages = [
  {
    name: 'Signature Greeting',
    price: 'from $95',
    details: 'Name, message, theme colors, and a styled mix of letters, icons, and fillers.',
  },
  {
    name: 'Milestone Moment',
    price: 'from $125',
    details: 'Large numbers, premium color story, extra props, and photo-forward styling.',
  },
  {
    name: 'Baby Welcome',
    price: 'from $145',
    details: 'Stork or baby bundle, keepsake-style announcement, and soft nursery accents.',
  },
];

const gallery = [
  'Happy 8th birthday Mia',
  'Welcome home baby Noah',
  'Class of 2027',
  'Cheers to 50 years',
];

const steps = [
  'Pick the occasion',
  'Request your date',
  'We confirm availability',
  'Your yard gets famous',
];

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3" href="/" aria-label="Front Yard Famous home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-xl font-semibold text-white">
              FYF
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none">
                Front Yard Famous
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-lawn sm:block">
                Celebration displays
              </span>
            </span>
          </a>
          <nav aria-label="Main navigation" className="hidden gap-7 text-sm font-semibold md:flex">
            <a className="transition hover:text-lawn" href="#occasions">
              Occasions
            </a>
            <a className="transition hover:text-lawn" href="#gallery">
              Gallery
            </a>
            <a className="transition hover:text-lawn" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-lawn" href="#booking">
              Book
            </a>
          </nav>
          <a
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-lawn"
            href="#booking"
          >
            Request a date
          </a>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-mint/80 to-transparent" />
        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:py-18">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-lawn/20 bg-white px-4 py-2 text-sm font-semibold text-lawn shadow-sm">
              Yard greetings, storks, milestones, and custom celebration displays
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] text-forest sm:text-6xl lg:text-7xl">
              Make their big day Front Yard Famous.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
              A modern, photo-ready way to celebrate birthdays, new babies,
              graduations, anniversaries, retirements, and everything that deserves a
              cheerful front-yard spotlight.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-coral px-6 py-3 text-center text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-ink"
                href="#booking"
              >
                Start a booking request
              </a>
              <a
                className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-lawn hover:text-lawn"
                href="#gallery"
              >
                See display ideas
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['6+', 'occasion types'],
                ['24 hr', 'typical setup'],
                ['0', 'customer login needed'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-ink/10 bg-white/78 p-4">
                  <p className="font-display text-3xl font-semibold text-forest">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-6 top-14 h-24 w-24 rounded-full bg-butter/80 blur-2xl" />
            <div className="absolute -right-8 bottom-16 h-28 w-28 rounded-full bg-coral/25 blur-2xl" />
            <div className="relative rounded-[2rem] border border-ink/10 bg-white p-4 shadow-soft">
              <div className="overflow-hidden rounded-[1.45rem] bg-linen">
                <div className="relative min-h-[470px] bg-gradient-to-b from-sky via-mint to-linen p-6">
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-lawn" />
                  <div className="absolute bottom-20 left-1/2 h-28 w-[86%] -translate-x-1/2 rounded-[100%] bg-lawn/35 blur-xl" />
                  <div className="relative mx-auto mt-4 flex max-w-sm items-end justify-center gap-2">
                    <SignTile color="bg-butter" label="H" />
                    <SignTile color="bg-blush" label="A" />
                    <SignTile color="bg-coral text-white" label="P" tall />
                    <SignTile color="bg-sky" label="P" />
                    <SignTile color="bg-mint" label="Y" />
                  </div>
                  <div className="relative mx-auto mt-4 max-w-sm rounded-3xl bg-white p-5 text-center shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-lawn">
                      Front Yard Famous
                    </p>
                    <p className="mt-2 font-display text-5xl font-semibold text-forest">
                      40
                    </p>
                    <p className="text-lg font-bold">Cheers, Marcus!</p>
                  </div>
                  <div className="relative mx-auto mt-5 grid max-w-sm grid-cols-4 gap-2">
                    {['stars', 'cake', 'balloons', 'name'].map((item, index) => (
                      <span
                        key={item}
                        className={`h-16 rounded-2xl border border-white/70 ${
                          ['bg-lilac', 'bg-butter', 'bg-blush', 'bg-sky'][index]
                        }`}
                        aria-label={item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="occasions" className="bg-linen py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-lawn">
                Occasions
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-forest md:text-5xl">
                Big, beautiful setups without the visual chaos.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-ink/65">
              Each setup can start from a clean package, then flex with names,
              colors, icons, themes, and premium add-ons as inventory grows.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((occasion) => (
              <article
                key={occasion.title}
                className="group rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className={`mb-8 h-28 rounded-2xl ${occasion.accent}`} />
                <h3 className="font-display text-2xl font-semibold text-forest">
                  {occasion.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{occasion.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lawn">
              Gallery direction
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-forest md:text-5xl">
              Built to show real inventory beautifully.
            </h2>
            <p className="mt-5 text-base leading-7 text-ink/68">
              The final gallery can hold real product photos, collection previews,
              package examples, and availability notes without burying customers in
              clutter.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((caption, index) => (
              <article
                key={caption}
                className="min-h-52 rounded-3xl border border-ink/10 bg-white p-4 shadow-sm"
              >
                <div
                  className={`grid h-36 place-items-center rounded-2xl text-center font-display text-3xl font-semibold text-forest ${
                    ['bg-butter', 'bg-sky', 'bg-mint', 'bg-blush'][index]
                  }`}
                >
                  {caption.split(' ').slice(0, 2).join(' ')}
                </div>
                <p className="mt-4 text-sm font-semibold text-ink/72">{caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-forest py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-butter">
              Package preview
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
              Simple starting prices, custom enough to feel personal.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {packages.map((item) => (
              <article key={item.name} className="rounded-3xl border border-white/12 bg-white/8 p-6">
                <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
                <p className="mt-4 text-3xl font-bold text-butter">{item.price}</p>
                <p className="mt-4 text-sm leading-6 text-white/72">{item.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-mint p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-lawn">
                Booking flow
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-forest md:text-5xl">
                Request first. Confirm availability manually.
              </h2>
              <p className="mt-5 text-base leading-7 text-ink/68">
                V1 should collect the date, address, occasion, design preferences,
                and contact details. You confirm inventory, route timing, and weather
                before asking for payment later.
              </p>
            </div>
            <div className="grid gap-3 p-6 sm:p-8">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl bg-cream p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-forest">{step}</p>
                </div>
              ))}
              <a
                className="mt-3 rounded-full bg-coral px-6 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink"
                href="mailto:hello@frontyardfamous.com?subject=Front%20Yard%20Famous%20booking%20request"
              >
                Draft booking request
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-linen">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-ink/62 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-ink">Front Yard Famous</p>
          <p>Modern yard greetings, storks, and milestone displays.</p>
        </div>
      </footer>
    </main>
  );
}

type SignTileProps = {
  color: string;
  label: string;
  tall?: boolean;
};

function SignTile({ color, label, tall = false }: SignTileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`grid w-14 place-items-center rounded-2xl border-2 border-white font-display text-3xl font-semibold shadow-sm ${color} ${
          tall ? 'h-28' : 'h-24'
        }`}
      >
        {label}
      </span>
      <span className="h-16 w-1 rounded-full bg-ink/45" />
    </div>
  );
}

export default App;
