export type ComplaintKind = "reclamo" | "queja";
export type DocumentType = "dni" | "ce" | "pasaporte";

export interface ComplaintPayload {
  kind: ComplaintKind;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  address?: string;
  phone?: string;
  email: string;
  isMinor: boolean;
  guardianName?: string;
  guardianDocumentNumber?: string;
  serviceDescription?: string;
  claimedAmount?: string;
  detail: string;
  request: string;
  // Honeypot anti-bot — debe quedar vacío (ver components/BookingWidget.tsx,
  // mismo patrón: campo invisible, si llega lleno es un bot).
  company?: string;
}

export interface ComplaintResponse {
  claimCode: string;
  submittedAt: string;
}

export class ComplaintApiError extends Error {}

export async function submitComplaint(payload: ComplaintPayload): Promise<ComplaintResponse> {
  const res = await fetch("/api/libro-de-reclamaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ComplaintApiError(body?.error ?? "send_failed");
  }
  return res.json();
}
