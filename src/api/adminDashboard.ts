import type {
  AdminDashboardData,
  BookingRecord,
  BookingStatus,
  InventoryAvailabilityItem,
  PackageCatalogItem,
} from '../types/business';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [bookingsResponse, inventoryResponse] = await Promise.all([
    fetch(`${apiBaseUrl}/api/bookings`),
    fetch(`${apiBaseUrl}/api/inventory`),
  ]);

  if (!bookingsResponse.ok) {
    throw new Error('Booking requests could not be loaded.');
  }

  if (!inventoryResponse.ok) {
    throw new Error('Inventory availability could not be loaded.');
  }

  const bookingsData = (await bookingsResponse.json()) as { bookings?: BookingRecord[] };
  const inventoryData = (await inventoryResponse.json()) as {
    inventory?: InventoryAvailabilityItem[];
    packages?: PackageCatalogItem[];
  };

  return {
    bookings: bookingsData.bookings || [],
    inventory: inventoryData.inventory || [],
    packages: inventoryData.packages || [],
  };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<BookingRecord> {
  const response = await fetch(`${apiBaseUrl}/api/bookings/${encodeURIComponent(id)}/status`, {
    body: JSON.stringify({ status }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data.booking as BookingRecord;
}

function getErrorMessage(data: unknown) {
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof data.error === 'string'
  ) {
    return data.error;
  }

  return 'The admin action could not be completed.';
}
