import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apu Garden Lodge",
    short_name: "Apu Garden Lodge",
    description: "Hotel boutique en Urubamba, Valle Sagrado, Cusco.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e4",
    theme_color: "#f7f1e4",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
