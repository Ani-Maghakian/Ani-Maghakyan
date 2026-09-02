import type { Metadata } from "next";
import { LocalizedPage } from "@/components/localized-page";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata("en");

export default function EnglishPage() {
  return <LocalizedPage locale="en" />;
}
