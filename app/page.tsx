import type { Metadata } from "next";
import { LocalizedPage } from "@/components/localized-page";
import { createMetadata } from "@/lib/seo";
import "./quality-overrides.css";

export const metadata: Metadata = createMetadata("hy");

export default function Home() {
  return <LocalizedPage locale="hy" />;
}