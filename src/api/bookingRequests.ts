import type { BookingRequestPayload, BookingSubmissionResponse } from '../types/business';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export async function submitBookingRequest(
  payload: BookingRequestPayload,
): Promise<BookingSubmissionResponse> {
  const response = await fetch(`${apiBaseUrl}/api/bookings`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as BookingSubmissionResponse;
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

  return 'The request could not be sent. Please try again or contact Front Yard Famous directly.';
}
