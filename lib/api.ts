const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

export type RoomType = "individual" | "doble" | "doble_deluxe" | "doble_deluxe_twin" | "deluxe_extragrande";

export interface RoomTypeAvailability {
  type: RoomType;
  available: boolean;
  price_pen: number;
  price_usd: number;
}

export interface AvailabilityResponse {
  check_in: string;
  check_out: string;
  room_types: RoomTypeAvailability[];
}

export class ApiError extends Error {}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? "Algo salió mal, intenta de nuevo.";
  } catch {
    return "Algo salió mal, intenta de nuevo.";
  }
}

export async function checkAvailability(checkIn: string, checkOut: string): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ check_in: checkIn, check_out: checkOut });
  const res = await fetch(`${API_URL}/public/availability?${params.toString()}`);
  if (!res.ok) throw new ApiError(await parseError(res));
  return res.json();
}

export interface BookingRequestPayload {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  room_type: RoomType;
  notes?: string;
  // Honeypot anti-bot: queda vacío para visitantes reales; solo lo llenan los
  // bots que completan todos los campos del formulario.
  company?: string;
}

export interface BookingRequestResponse {
  id: string;
  // false = no había cuarto de ese tipo libre para esas fechas — la
  // solicitud quedó en lista de espera, recepción la resuelve a mano.
  room_assigned: boolean;
}

export async function createBookingRequest(payload: BookingRequestPayload): Promise<BookingRequestResponse> {
  const res = await fetch(`${API_URL}/public/booking-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new ApiError(await parseError(res));
  return res.json();
}
