const occasions = [
  'Birthdays',
  'New baby',
  'Graduation',
  'Anniversary',
  'Retirement',
  'Custom moments',
];

function App() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between gap-6">
          <a className="font-display text-2xl font-semibold" href="/">
            Front Yard Famous
          </a>
          <nav aria-label="Main navigation" className="hidden gap-6 text-sm font-medium md:flex">
            <a className="hover:text-lawn" href="#occasions">
              Occasions
            </a>
            <a className="hover:text-lawn" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-lawn" href="#booking">
              Book
            </a>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-mint px-4 py-2 text-sm font-semibold text-lawn">
              Modern yard greetings and celebration displays
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl">
              Make their big day Front Yard Famous.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/72">
              Beautifully styled yard signs, storks, milestone numbers, and custom
              displays for birthdays, babies, graduations, retirements, and the
              moments worth making visible.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-lawn"
                href="#booking"
              >
                Start a booking request
              </a>
              <a
                className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-lawn hover:text-lawn"
                href="#occasions"
              >
                Explore occasions
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-4 shadow-soft">
            <div className="grid aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sky p-5">
              <div className="rounded-t-[1.25rem] bg-lawn/90 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Today only</p>
                <p className="mt-4 font-display text-5xl font-semibold">Happy 40th</p>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-white p-5">
                <span className="rounded-xl bg-butter p-4 font-display text-3xl font-semibold">Y</span>
                <span className="rounded-xl bg-blush p-4 font-display text-3xl font-semibold">A</span>
                <span className="rounded-xl bg-mint p-4 font-display text-3xl font-semibold">Y</span>
                <span className="col-span-2 rounded-xl bg-ink p-4 text-lg font-semibold text-white">
                  Front-yard ready
                </span>
                <span className="rounded-xl bg-sky p-4 font-display text-3xl font-semibold">!</span>
              </div>
            </div>
          </div>
        </div>

        <section id="occasions" className="grid gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <article key={occasion} className="rounded-2xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-2xl font-semibold">{occasion}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Styled displays with colors, themes, and add-ons tailored to the moment.
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default App;

