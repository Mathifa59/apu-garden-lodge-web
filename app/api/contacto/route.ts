import { Resend } from "resend";
import type { ContactMessagePayload } from "@/lib/contactMessage";
import { BRAND, emailShell, preheader, row } from "@/lib/emailBrand";

// Remitente propio (distinto de reclamos@ y reservas@) para que se distinga
// de un vistazo en la bandeja de entrada de qué formulario vino cada correo.
const FROM_EMAIL = "Apu Garden Lodge <contacto@apu-garden-lodge.com>";
const TO_EMAIL = process.env.COMPLAINTS_EMAIL_TO ?? "sgutierrezvilla@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<ContactMessagePayload>): string[] {
  const missing: string[] = [];
  if (!body.name || !body.name.trim()) missing.push("name");
  if (!body.email || !EMAIL_RE.test(body.email)) missing.push("email");
  if (!body.message || !body.message.trim()) missing.push("message");
  return missing;
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(date);
}

function messageEmailHtml(body: ContactMessagePayload, submittedAt: string): string {
  const content = `
    <h1 style="margin:0 0 6px;font-size:21px;font-weight:700;color:${BRAND.ink};">Nuevo mensaje de contacto</h1>
    <p style="margin:0 0 20px;font-size:13px;color:${BRAND.inkSoft};">
      Recibido el ${submittedAt} (hora Perú) desde el formulario de contacto del sitio.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${row("Nombre", body.name)}
      ${row("Email", body.email)}
      ${row("Teléfono", body.phone)}
      ${row("Mensaje", body.message)}
    </table>
    <p style="margin:20px 0 0;font-size:12px;color:${BRAND.inkSoft};">
      Responder directamente a este correo llega a
      <a href="mailto:${body.email}" style="color:${BRAND.terracotta};">${body.email}</a>.
    </p>
  `;
  return preheader(`${body.name}: ${body.message.slice(0, 80)}`) + emailShell(BRAND.terracotta, "Contacto", body.name, content);
}

export async function POST(request: Request) {
  let body: Partial<ContactMessagePayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: si un bot llenó el campo invisible, respondemos como si
  // hubiera funcionado (sin enviar nada) para no delatarlo — mismo patrón
  // que /api/libro-de-reclamaciones.
  if (body.company) {
    return Response.json({ ok: true });
  }

  const missing = validate(body);
  if (missing.length > 0) {
    return Response.json({ error: `missing_fields:${missing.join(",")}` }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada — no se puede enviar el mensaje de contacto");
    return Response.json({ error: "server_not_configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const payload = body as ContactMessagePayload;
  const submittedAt = formatSubmittedAt(new Date());

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: payload.email,
      subject: `Nuevo mensaje de contacto — ${payload.name}`,
      html: messageEmailHtml(payload, submittedAt),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Error enviando el mensaje de contacto por Resend", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
