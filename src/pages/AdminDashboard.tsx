import { useEffect, useMemo, useState } from 'react';
import { getAdminDashboardData, updateBookingStatus } from '../api/adminDashboard';
import { BuilderYardScene } from '../components/BuilderYardScene';
import { blackoutDates } from '../data/adminContent';
import type {
  AdminDashboardData,
  BookingRecord,
  BookingStatus,
  BuilderBookingLayout,
  InventoryAvailabilityItem,
} from '../types/business';

const statusLabels: Record<BookingStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  confirmed: 'Confirmed',
  declined: 'Declined',
  completed: 'Completed',
};

const statusClasses: Record<BookingStatus, string> = {
  new: 'border-coral/25 bg-coral/10 text-coral',
  reviewing: 'border-butter/40 bg-butter/20 text-forest',
  confirmed: 'border-lawn/25 bg-mint text-lawn',
  declined: 'border-ink/12 bg-ink/6 text-ink/62',
  completed: 'border-forest/18 bg-forest/8 text-forest',
};

const statusOptions: BookingStatus[] = ['new', 'reviewing', 'confirmed', 'declined', 'completed'];

type AdminLoadState =
  | { status: 'loading' }
  | { status: 'ready'; data: AdminDashboardData }
  | { status: 'error'; message: string };

function AdminDashboard() {
  const [loadState, setLoadState] = useState<AdminLoadState>({ status: 'loading' });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  async function loadDashboard() {
    setLoadState({ status: 'loading' });
    setActionMessage(null);

    try {
      const data = await getAdminDashboardData();
      setLoadState({ data, status: 'ready' });
    } catch (error) {
      setLoadState({
        message:
          error instanceof Error
            ? error.message
            : 'The admin dashboard could not be loaded.',
        status: 'error',
      });
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function handleStatusChange(id: string, status: BookingStatus) {
    if (loadState.status !== 'ready') {
      return;
    }

    setUpdatingId(id);
    setActionMessage(null);

    try {
      const updatedBooking = await updateBookingStatus(id, status);
      setLoadState({
        data: {
          ...loadState.data,
          bookings: loadState.data.bookings.map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking,
          ),
        },
        status: 'ready',
      });
      setActionMessage(`${updatedBooking.id} moved to ${statusLabels[updatedBooking.status]}.`);
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : 'The booking status could not be updated.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const metrics = useMemo(() => {
    if (loadState.status !== 'ready') {
      return [];
    }

    return buildMetrics(loadState.data.bookings, loadState.data.inventory);
  }, [loadState]);

  return (
    <main className="min-h-screen bg-linen text-ink">
      <AdminHeader />

      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-lawn">Demo operations suite</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-forest sm:text-5xl">
              A polished booking workflow for local event rentals.
            </h1>
          </div>
          <p className="max-w-2xl leading-7 text-ink/68">
            Review requests, adjust booking statuses, track available inventory, and
            present a complete operator workflow from a lightweight demo API.
          </p>
        </div>
      </section>

      {loadState.status === 'loading' ? <AdminLoadingState /> : null}
      {loadState.status === 'error' ? (
        <AdminErrorState message={loadState.message} onRetry={loadDashboard} />
      ) : null}
      {loadState.status === 'ready' ? (
        <>
          <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="bg-white p-5">
                  <p className="text-sm font-semibold text-lawn">{metric.label}</p>
                  <p className="mt-3 font-display text-4xl font-semibold text-forest">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/58">{metric.detail}</p>
                </article>
              ))}
            </div>
          </section>

          {actionMessage ? (
            <div className="mx-auto max-w-6xl px-5 pb-6 sm:px-8">
              <p className="border border-lawn/20 bg-mint px-4 py-3 text-sm font-semibold text-lawn">
                {actionMessage}
              </p>
            </div>
          ) : null}

          <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <BookingQueue
                bookings={loadState.data.bookings}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
              />
              <PackageManager packages={loadState.data.packages} />
            </div>

            <aside className="space-y-8">
              <InventoryAvailabilityPanel items={loadState.data.inventory} />
              <BlackoutPanel />
            </aside>
          </section>
        </>
      ) : null}
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
          <a
            className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn"
            href="#requests"
          >
            Requests
          </a>
          <a
            className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn"
            href="#inventory"
          >
            Inventory
          </a>
          <a
            className="border border-ink/12 bg-white px-4 py-2 text-ink/72 transition hover:border-lawn hover:text-lawn"
            href="/"
          >
            Public site
          </a>
        </nav>
      </div>
    </header>
  );
}

function AdminLoadingState() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-4">
        {['Requests', 'Confirmed', 'Inventory', 'Unavailable'].map((label) => (
          <article key={label} className="bg-white p-5">
            <p className="text-sm font-semibold text-lawn">{label}</p>
            <div className="mt-4 h-9 w-16 bg-cream" />
            <div className="mt-4 h-3 w-36 bg-cream" />
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
      <div className="border border-coral/25 bg-white p-8">
        <p className="text-sm font-semibold uppercase text-coral">Admin API unavailable</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-forest">
          Start the local API to view the demo workflow.
        </h2>
        <p className="mt-4 leading-7 text-ink/68">{message}</p>
        <button
          className="mt-6 bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lawn"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      </div>
    </section>
  );
}

function BookingQueue({
  bookings,
  onStatusChange,
  updatingId,
}: {
  bookings: BookingRecord[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  updatingId: string | null;
}) {
  return (
    <section id="requests" className="border border-ink/10 bg-white">
      <div className="grid gap-4 border-b border-ink/10 p-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-semibold text-lawn">Booking requests</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
            Live demo request queue
          </h2>
        </div>
        <p className="text-sm font-semibold text-ink/45">{bookings.length} requests</p>
      </div>
      {bookings.length > 0 ? (
        <div className="divide-y divide-ink/10">
          {bookings.map((request) => (
            <BookingRequestRow
              key={request.id}
              request={request}
              onStatusChange={onStatusChange}
              updating={updatingId === request.id}
            />
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="No booking requests yet."
          text="Submitted demo bookings will appear here after the API receives them."
        />
      )}
    </section>
  );
}

function BookingRequestRow({
  request,
  onStatusChange,
  updating,
}: {
  request: BookingRecord;
  onStatusChange: (id: string, status: BookingStatus) => void;
  updating: boolean;
}) {
  return (
    <article className="grid gap-5 p-6 xl:grid-cols-[0.72fr_0.28fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink/45">{request.id}</span>
          <StatusBadge status={request.status} />
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold text-forest">
          {request.displayMessage}
        </h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <AdminDetail label="Customer" value={request.name} />
          <AdminDetail label="Date" value={formatAdminDate(request.eventDate)} />
          <AdminDetail label="Setup" value={request.setupWindow} />
          <AdminDetail label="Area" value={request.serviceArea} />
        </dl>
        <p className="mt-4 text-sm leading-6 text-ink/58">
          {request.themeNotes || 'No theme notes added.'}
        </p>
        <BuilderLayoutAdminPreview layout={request.builderLayout} />
      </div>

      <div className="border-l-0 border-ink/10 text-sm xl:border-l xl:pl-5">
        <label className="grid gap-2 font-semibold text-forest">
          Status
          <select
            className="border border-ink/12 bg-cream px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-lawn disabled:cursor-not-allowed disabled:bg-ink/8"
            disabled={updating}
            onChange={(event) => onStatusChange(request.id, event.target.value as BookingStatus)}
            value={request.status}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-4 leading-6 text-ink/58">
          Submitted {formatAdminDate(request.createdAt)}. Last updated{' '}
          {formatAdminDate(request.updatedAt)}.
        </p>
      </div>
    </article>
  );
}

function BuilderLayoutAdminPreview({ layout }: { layout?: BuilderBookingLayout | null }) {
  if (!layout) {
    return null;
  }

  return (
    <div className="mt-5 border border-lawn/18 bg-mint p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-sm font-semibold text-lawn">Builder concept</p>
          <p className="mt-1 text-sm leading-6 text-ink/68">{layout.summary}</p>
        </div>
        <span className="bg-white px-3 py-1 text-xs font-semibold text-forest">
          {layout.pieces.length} pieces
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {layout.pieces.slice(0, 10).map((piece) => (
          <span key={piece.instanceId} className="border border-white/70 bg-white/80 px-2 py-1 text-xs font-semibold text-ink/62">
            {piece.label}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <BuilderYardScene compact layout={layout.pieces} />
      </div>
    </div>
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

function PackageManager({ packages }: { packages: AdminDashboardData['packages'] }) {
  return (
    <section className="border border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-6">
        <p className="text-sm font-semibold text-lawn">Pricing setup</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
          Demo package catalog
        </h2>
      </div>
      {packages.length > 0 ? (
        <div className="divide-y divide-ink/10">
          {packages.map((tier) => (
            <article key={tier.id} className="grid gap-4 p-6 md:grid-cols-[0.68fr_0.32fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold text-forest">{tier.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  Ready for buyer customization, service zones, and package rules.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-xl font-semibold text-coral">{tier.priceLabel}</p>
                <p className="mt-2 text-sm text-ink/50">API-backed demo data</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyPanel title="No packages available." text="Package data will appear here when the API responds." />
      )}
    </section>
  );
}

function InventoryAvailabilityPanel({ items }: { items: InventoryAvailabilityItem[] }) {
  return (
    <section id="inventory" className="border border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-6">
        <p className="text-sm font-semibold text-lawn">Inventory</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
          Availability view
        </h2>
      </div>
      {items.length > 0 ? (
        <div className="divide-y divide-ink/10">
          {items.map((item) => (
            <InventoryAvailabilityRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyPanel title="No inventory loaded." text="Inventory availability will appear here when the API responds." />
      )}
    </section>
  );
}

function InventoryAvailabilityRow({ item }: { item: InventoryAvailabilityItem }) {
  const available = Math.max(item.quantity - item.reserved, 0);
  const reservedPercent = item.quantity > 0 ? Math.min((item.reserved / item.quantity) * 100, 100) : 0;

  return (
    <article className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-forest">{item.name}</h3>
          <p className="mt-1 text-sm capitalize text-ink/50">{item.category}</p>
        </div>
        <span className="bg-cream px-3 py-1 text-xs font-semibold text-ink/62">
          {available} open
        </span>
      </div>
      <div className="mt-4 h-2 bg-cream">
        <div className="h-2 bg-coral" style={{ width: `${reservedPercent}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/58">
        {item.reserved} reserved of {item.quantity}. Status: {item.status}.
      </p>
    </article>
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

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-8 text-center">
      <h3 className="font-display text-2xl font-semibold text-forest">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/58">{text}</p>
    </div>
  );
}

function buildMetrics(bookings: BookingRecord[], inventory: InventoryAvailabilityItem[]) {
  const newCount = bookings.filter((booking) => booking.status === 'new').length;
  const confirmedCount = bookings.filter((booking) => booking.status === 'confirmed').length;
  const inventoryAlerts = inventory.filter((item) => item.reserved >= item.quantity).length;

  return [
    {
      label: 'New requests',
      value: String(newCount),
      detail: 'Waiting for review',
    },
    {
      label: 'Confirmed',
      value: String(confirmedCount),
      detail: 'Ready for setup planning',
    },
    {
      label: 'Inventory alerts',
      value: String(inventoryAlerts),
      detail: 'Fully reserved or capacity-limited',
    },
    {
      label: 'Blackout dates',
      value: String(blackoutDates.length),
      detail: 'Unavailable demo dates',
    },
  ];
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value.includes('T') ? value : `${value}T00:00:00`));
}

export { AdminDashboard };
