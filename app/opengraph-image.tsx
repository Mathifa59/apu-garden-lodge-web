import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f1e4",
          fontFamily: "serif",
        }}
      >
        <svg width="90" height="90" viewBox="0 0 40 40" fill="none">
          <path
            d="M4 30 L15 11 L20 19 L25 9 L36 30 Z"
            stroke="#5c6b47"
            strokeWidth="2.4"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="25" cy="7" r="2.8" fill="#5c6b47" />
        </svg>
        <div style={{ marginTop: 28, fontSize: 76, fontStyle: "italic", color: "#2b2a22" }}>Apu Garden</div>
        <div style={{ marginTop: 4, fontSize: 26, letterSpacing: 10, color: "#b5562e" }}>LODGE</div>
        <div style={{ marginTop: 22, fontSize: 22, letterSpacing: 6, color: "#54513f" }}>
          DESCANSO · NATURALEZA · EXPERIENCIA
        </div>
      </div>
    ),
    size
  );
}
