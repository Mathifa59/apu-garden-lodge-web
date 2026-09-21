import { Resend } from "resend";
import type { ComplaintPayload } from "@/lib/complaints";

// Dominio propio verificado en Resend (2026-09-21) — ya no depende del
// sandbox, así que la copia de cortesía le llega a cualquier consumidor que
// reclame, no solo a la cuenta de Resend.
const FROM_EMAIL = "Apu Garden Lodge <reclamos@apu-garden-lodge.com>";
const TO_EMAIL = process.env.COMPLAINTS_EMAIL_TO ?? "sgutierrezvilla@gmail.com";

const BUSINESS = {
  razonSocial: "CATNET PERU SAC",
  ruc: "20608166204",
  direccion: "Cidruchayoc, lote 178, sector Yanaconas, Urubamba, Cusco, Perú",
};

// Mismos tokens de color que app/globals.css, en hex — los clientes de
// correo no leen custom properties de CSS, así que no se pueden reusar las
// variables del sitio y hay que repetirlas acá.
const BRAND = {
  cream: "#f7f1e4",
  creamSoft: "#fbf7ee",
  sand: "#efe3c6",
  ink: "#2b2a22",
  inkSoft: "#54513f",
  sageDeep: "#3f4a30",
  sagePale: "#dde3c8",
  terracotta: "#83664a",
};
const SITE_URL = "https://apu-garden-lodge.com";
const LOGO_URL = `${SITE_URL}/logo-white.png`;
const FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

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

// Envoltorio compartido por los dos correos — header con logo sobre fondo
// salvia oscuro, banda de color con tipo+código, y footer con los datos del
// proveedor (obligatorios en cualquier comunicación del Libro de
// Reclamaciones). Tablas anidadas en vez de flexbox/grid porque Outlook
// desktop (motor Word) no soporta CSS moderno — esto sí renderiza igual en
// todos los clientes, aunque sea más verboso.
function emailShell(bannerColor: string, bannerLabel: string, claimCode: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:${BRAND.sand};font-family:${FONT_STACK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.sand};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${BRAND.creamSoft};border-radius:18px;border:1px solid ${BRAND.sagePale};">
            <tr>
              <td style="background:${BRAND.sageDeep};padding:28px 32px;text-align:center;border-radius:18px 18px 0 0;">
                <img src="${LOGO_URL}" width="150" alt="Apu Garden Lodge" style="display:block;margin:0 auto;border:0;outline:none;" />
              </td>
            </tr>
            <tr>
              <td style="background:${bannerColor};padding:12px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:#ffffff;">
                      ${bannerLabel}
                    </td>
                    <td align="right" style="font-size:13px;font-weight:700;color:#ffffff;">${claimCode}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid ${BRAND.sagePale};text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.7;color:${BRAND.inkSoft};">
                  <strong style="color:${BRAND.ink};">${BUSINESS.razonSocial}</strong> — RUC ${BUSINESS.ruc}<br/>
                  ${BUSINESS.direccion}<br/>
                  <a href="${SITE_URL}" style="color:${BRAND.terracotta};text-decoration:none;">apu-garden-lodge.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Texto oculto que los clientes de correo muestran como adelanto en la
// bandeja de entrada, antes de abrir el mensaje.
function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${text}</div>`;
}

function row(label: string, value: string | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px 10px 0;color:${BRAND.inkSoft};font-size:12px;font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid ${BRAND.sagePale};">${label}</td>
    <td style="padding:10px 0;color:${BRAND.ink};font-size:14px;line-height:1.5;vertical-align:top;border-bottom:1px solid ${BRAND.sagePale};">${value.replace(/\n/g, "<br/>")}</td>
  </tr>`;
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
