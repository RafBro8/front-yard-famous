import { adminBookingRequests, adminMetrics, blackoutDates } from '../data/adminContent';
import { inventoryItems, packages } from '../data/siteContent';
import type { AdminBookingRequest, BookingStatus, InventoryStatus } from '../types/business';

const statusLabels: Record<BookingStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  confirmed: 'Confirmed',
  declined: 'Declined',
  completed: 'Completed',
};

const statusClasses: Record<BookingStatus, string> = {
  new: 'border-coral/25 bg-coral/10 text-coral',
  reviewing: 'border-butter/40 bg-butter/16 text-forest',
  confirmed: 'border-lawn/25 bg-mint text-lawn',
  declined: 'border-ink/12 bg-ink/6 text-ink/62',
  completed: 'border-forest/18 bg-forest/8 text-forest',
};

const inventoryStatusLabels: Record<InventoryStatus, string> = {
  planned: 'Planned',
  priority: 'Priority',
  owned: 'Owned',
};

function AdminDashboard() {
  const priorityInventory = inventoryItems.filter((item) => item.status !== 'owned');

  return (
    <main className="min-h-screen bg-linen text-ink">
      <AdminHeader />

      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-lawn">Private operations</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-forest sm:text-5xl">
              Booking and inventory command center.
            </h1>
          </div>
          <p className="max-w-2xl leading-7 text-ink/68">
            Stage 5 keeps the customer site simple while giving you a dedicated view for
            requests, package planning, inventory priorities, and unavailable dates.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-4">
          {adminMetrics.map((metric) => (
            <article key={metric.label} className="bg-white p-5">
              <p className="text-sm font-semibold text-lawn">{metric.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold text-forest">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-ink/58">{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <BookingQueue />
          <PackageManager />
        </div>

        <aside className="space-y-8">
          <InventoryPanel items={priorityInventory} />
          <BlackoutPanel />
        </aside>
      </section>
    </main>
  );
}

function AdminHeader() {
  return (
    <header className="border-b border-ink/10 bg-linen">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <a className="font-display text-2xl font-semibold text-forest" href="/admin">
          Front Yard Famous Admin
        </a>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold" aria-label="Admin navigation">
          <a className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn" href="#requests">
            Requests
          </a>
          <a className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn" href="#inventory">
            Inventory
          </a>
          <a className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn" href="/">
            Public site
          </a>
        </nav>
      </div>
    </header>
  );
}

function BookingQueue() {
  return (
    <section id="requests" className="border border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-6">
        <p className="text-sm font-semibold text-lawn">Booking requests</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
          Review queue
        </h2>
      </div>
      <div className="divide-y divide-ink/10">
        {adminBookingRequests.map((request) => (
          <BookingRequestRow key={request.id} request={request} />
        ))}
      </div>
    </section>
  );
}

function BookingRequestRow({ request }: { request: AdminBookingRequest }) {
  return (
    <article className="grid gap-5 p-6 xl:grid-cols-[0.76fr_0.24fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink/45">{request.id}</span>
          <StatusBadge status={request.status} />
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold text-forest">
          {request.displayMessage}
        </h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <AdminDetail label="Customer" value={request.customerName} />
          <AdminDetail label="Date" value={formatAdminDate(request.eventDate)} />
          <AdminDetail label="Setup" value={request.setupWindow} />
          <AdminDetail label="Area" value={request.serviceArea} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {request.inventoryNeeds.map((need) => (
            <span key={need} className="bg-mint px-3 py-1.5 text-xs font-semibold text-lawn">
              {need}
            </span>
          ))}
        </div>
      </div>

      <div className="border-l-0 border-ink/10 text-sm xl:border-l xl:pl-5">
        <p className="font-semibold text-forest">{request.estimateLabel}</p>
        <p className="mt-2 leading-6 text-ink/58">{request.routeNotes}</p>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`border px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function AdminDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-lawn">{label}</dt>
      <dd className="mt-1 text-ink/70">{value}</dd>
    </div>
  );
}

function PackageManager() {
  return (
    <section className="border border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-6">
        <p className="text-sm font-semibold text-lawn">Pricing setup</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
          Package controls
        </h2>
      </div>
      <div className="divide-y divide-ink/10">
        {packages.map((tier) => (
          <article key={tier.id} className="grid gap-4 p-6 md:grid-cols-[0.68fr_0.32fr]">
            <div>
              <h3 className="font-display text-2xl font-semibold text-forest">{tier.name}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/62">{tier.description}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xl font-semibold text-coral">{tier.priceLabel}</p>
              <p className="mt-2 text-sm text-ink/50">{tier.includes.length} included items</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InventoryPanel({ items }: { items: typeof inventoryItems }) {
  return (
    <section id="inventory" className="border border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-6">
        <p className="text-sm font-semibold text-lawn">Inventory</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
          Priority list
        </h2>
      </div>
      <div className="divide-y divide-ink/10">
        {items.map((item) => (
          <article key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-forest">{item.name}</h3>
              <span className="bg-cream px-3 py-1 text-xs font-semibold text-ink/62">
                {inventoryStatusLabels[item.status]}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/58">{item.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlackoutPanel() {
  return (
    <section className="border border-ink/10 bg-forest text-white">
      <div className="border-b border-white/12 p-6">
        <p className="text-sm font-semibold text-butter">Availability</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Blackout dates</h2>
      </div>
      <div className="divide-y divide-white/12">
        {blackoutDates.map((date) => (
          <article key={date.id} className="p-5">
            <p className="text-sm font-semibold text-butter">{formatAdminDate(date.date)}</p>
            <h3 className="mt-2 font-semibold">{date.label}</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">{date.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export { AdminDashboard };
