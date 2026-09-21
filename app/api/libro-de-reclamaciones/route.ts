import { Resend } from "resend";
import type { ComplaintPayload } from "@/lib/complaints";
import { BRAND, emailShell, preheader, row } from "@/lib/emailBrand";

// Dominio propio verificado en Resend (2026-09-21) — ya no depende del
// sandbox, así que la copia de cortesía le llega a cualquier consumidor que
// reclame, no solo a la cuenta de Resend.
const FROM_EMAIL = "Apu Garden Lodge <reclamos@apu-garden-lodge.com>";
const TO_EMAIL = process.env.COMPLAINTS_EMAIL_TO ?? "sgutierrezvilla@gmail.com";

const REQUIRED_FIELDS: (keyof ComplaintPayload)[] = [
  "kind",
  "fullName",
  "documentType",
  "documentNumber",
  "email",
  "detail",
  "request",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<ComplaintPayload>): string[] {
  const missing = REQUIRED_FIELDS.filter((field) => !body[field] || String(body[field]).trim() === "");
  if (body.email && !EMAIL_RE.test(body.email)) missing.push("email");
  if (body.isMinor && (!body.guardianName || !body.guardianDocumentNumber)) {
    missing.push("guardianName", "guardianDocumentNumber");
  }
  return missing;
}

// Sin base de datos no hay un correlativo global confiable entre reclamos —
// este código sirve como referencia única para que el consumidor y el hotel
// identifiquen el caso en el correo, no como el número de libro formal.
function generateClaimCode(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RC-${datePart}-${rand}`;
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(date);
}

function businessEmailHtml(body: ComplaintPayload, claimCode: string, submittedAt: string): string {
  const kindLabel = body.kind === "queja" ? "Queja" : "Reclamo";
  const content = `
    <h1 style="margin:0 0 6px;font-size:21px;font-weight:700;color:${BRAND.ink};">${kindLabel} nuevo</h1>
    <p style="margin:0 0 20px;font-size:13px;color:${BRAND.inkSoft};">
      Recibido el ${submittedAt} (hora Perú) a través del Libro de Reclamaciones Virtual.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${row("Nombre", body.fullName)}
      ${row("Documento", `${body.documentType.toUpperCase()} ${body.documentNumber}`)}
      ${row("Domicilio", body.address)}
      ${row("Teléfono", body.phone)}
      ${row("Email", body.email)}
      ${body.isMinor ? row("Tutor/a", `${body.guardianName} — Doc. ${body.guardianDocumentNumber}`) : ""}
      ${row("Servicio contratado", body.serviceDescription)}
      ${row("Monto reclamado", body.claimedAmount)}
      ${row("Detalle", body.detail)}
      ${row("Pedido concreto", body.request)}
    </table>
    <p style="margin:20px 0 0;font-size:12px;color:${BRAND.inkSoft};">
      Responder directamente a este correo llega a
      <a href="mailto:${body.email}" style="color:${BRAND.terracotta};">${body.email}</a>.
    </p>
  `;
  return preheader(`${kindLabel} de ${body.fullName} — código ${claimCode}`) + emailShell(BRAND.terracotta, kindLabel, claimCode, content);
}

function consumerEmailHtml(body: ComplaintPayload, claimCode: string, submittedAt: string): string {
  const kindLabel = body.kind === "queja" ? "queja" : "reclamo";
  const content = `
    <h1 style="margin:0 0 12px;font-size:21px;font-weight:700;color:${BRAND.ink};">¡Recibimos tu ${kindLabel}!</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${BRAND.inkSoft};">
      Hola ${body.fullName}, confirmamos la recepción de tu ${kindLabel} sobre el servicio de Apu Garden Lodge.
      Guarda este código — lo vas a necesitar si nos escribes por este caso.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="background:${BRAND.sagePale};border-radius:12px;padding:20px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.sageDeep};">
            Código de referencia
          </p>
          <p style="margin:0;font-size:26px;font-weight:700;letter-spacing:0.02em;color:${BRAND.terracotta};">${claimCode}</p>
        </td>
      </tr>
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:${BRAND.inkSoft};">Recibido el ${submittedAt} (hora Perú).</p>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${BRAND.inkSoft};">
      Conforme al Código de Protección y Defensa del Consumidor, te responderemos en un plazo máximo de
      <strong style="color:${BRAND.ink};">30 días calendario</strong>.
    </p>
  `;
  return preheader(`Tu código de referencia es ${claimCode}`) + emailShell(BRAND.sageDeep, "Constancia", claimCode, content);
}

export async function POST(request: Request) {
  let body: Partial<ComplaintPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: si un bot llenó el campo invisible, respondemos como si
  // hubiera funcionado (sin enviar nada) para no delatarlo.
  if (body.company) {
    return Response.json({ claimCode: generateClaimCode(), submittedAt: new Date().toISOString() });
  }

  const missing = validate(body);
  if (missing.length > 0) {
    return Response.json({ error: `missing_fields:${missing.join(",")}` }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada — no se puede enviar el reclamo");
    return Response.json({ error: "server_not_configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const payload = body as ComplaintPayload;
  const claimCode = generateClaimCode();
  const submittedAtDate = new Date();
  const submittedAt = formatSubmittedAt(submittedAtDate);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: payload.email,
      subject: `[${payload.kind === "queja" ? "Queja" : "Reclamo"} ${claimCode}] ${payload.fullName}`,
      html: businessEmailHtml(payload, claimCode, submittedAt),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Error enviando el reclamo por Resend", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  // Copia de cortesía al consumidor — best effort: si falla (ej. remitente
  // sandbox sin dominio verificado, solo puede mandar a TO_EMAIL) no debe
  // tumbar la respuesta al usuario, porque el reclamo YA quedó registrado.
  resend.emails
    .send({
      from: FROM_EMAIL,
      to: payload.email,
      subject: `Constancia de tu ${payload.kind === "queja" ? "queja" : "reclamo"} — Apu Garden Lodge (${claimCode})`,
      html: consumerEmailHtml(payload, claimCode, submittedAt),
    })
    .catch((err) => console.error("No se pudo enviar la copia de cortesía al consumidor", err));

  return Response.json({ claimCode, submittedAt: submittedAtDate.toISOString() });
}
