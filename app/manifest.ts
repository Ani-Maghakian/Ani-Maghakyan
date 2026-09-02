import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ani Maghakyan — Filmography",
    short_name: "A. Maghakyan",
    description: "Official filmography of Armenian screenwriter Ani Maghakyan.",
    start_url: ".",
    display: "standalone",
    background_color: "#f1eadf",
    theme_color: "#f1eadf",
    icons: [{ src: "./favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
