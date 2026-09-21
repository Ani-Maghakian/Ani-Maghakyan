import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maghakian Scripts",
    short_name: "Maghakian Scripts",
    description: "Official filmography of Armenian screenwriter Ani Maghakyan.",
    start_url: ".",
    display: "standalone",
    background_color: "#f1eadf",
    theme_color: "#f1eadf",
    icons: [{ src: "./favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
