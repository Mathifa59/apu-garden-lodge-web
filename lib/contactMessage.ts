export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  // Honeypot anti-bot — debe quedar vacío (mismo patrón que
  // ComplaintsBookForm.tsx y BookingWidget.tsx).
  company?: string;
}

export class ContactMessageApiError extends Error {}

export async function submitContactMessage(payload: ContactMessagePayload): Promise<void> {
  const res = await fetch("/api/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ContactMessageApiError(body?.error ?? "send_failed");
  }
}
