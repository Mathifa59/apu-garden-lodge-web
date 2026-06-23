import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f1e4",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
          <path d="M4 30 L15 11 L20 19 L25 9 L36 30 Z" stroke="#5c6b47" strokeWidth="3" strokeLinejoin="round" fill="none" />
          <circle cx="25" cy="7" r="3" fill="#5c6b47" />
        </svg>
      </div>
    ),
    size
  );
}
