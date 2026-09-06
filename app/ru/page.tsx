import type { Metadata } from "next";
import { LocalizedPage } from "@/components/localized-page";
import { createMetadata } from "@/lib/seo";
import "../quality-overrides.css";

export const metadata: Metadata = createMetadata("ru");

export default function RussianPage() {
  return <LocalizedPage locale="ru" />;
}