// Envoltorio de marca compartido por los correos que salen de este sitio
// (Libro de Reclamaciones, formulario de Contacto) — logo, colores y footer
// con los datos del proveedor, para que cualquier correo nuevo se vea
// consistente sin reconstruir el layout desde cero.
//
// Tablas anidadas con estilos en línea en vez de flexbox/grid: Outlook
// desktop (motor Word) no soporta CSS moderno, y esto sí renderiza igual en
// todos los clientes de correo.

export const BUSINESS = {
  razonSocial: "CATNET PERU SAC",
  ruc: "20608166204",
  direccion: "Cidruchayoc, lote 178, sector Yanaconas, Urubamba, Cusco, Perú",
};

// Mismos tokens de color que app/globals.css, en hex — los clientes de
// correo no leen custom properties de CSS.
export const BRAND = {
  cream: "#f7f1e4",
  creamSoft: "#fbf7ee",
  sand: "#efe3c6",
  ink: "#2b2a22",
  inkSoft: "#54513f",
  sageDeep: "#3f4a30",
  sagePale: "#dde3c8",
  terracotta: "#83664a",
};
export const SITE_URL = "https://apu-garden-lodge.com";
export const LOGO_URL = `${SITE_URL}/logo-white.png`;
export const FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function emailShell(bannerColor: string, bannerLabel: string, bannerRight: string, bodyHtml: string): string {
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
                    <td align="right" style="font-size:13px;font-weight:700;color:#ffffff;">${bannerRight}</td>
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
export function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${text}</div>`;
}

export function row(label: string, value: string | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px 10px 0;color:${BRAND.inkSoft};font-size:12px;font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid ${BRAND.sagePale};">${label}</td>
    <td style="padding:10px 0;color:${BRAND.ink};font-size:14px;line-height:1.5;vertical-align:top;border-bottom:1px solid ${BRAND.sagePale};">${value.replace(/\n/g, "<br/>")}</td>
  </tr>`;
}
