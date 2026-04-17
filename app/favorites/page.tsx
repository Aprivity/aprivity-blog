import type { Metadata } from "next";
import { InspirationWallSection } from "@/components/inspiration-wall-section";

export const metadata: Metadata = {
  title: "Frontend Inspirations | Aprivity_ Portfolio",
  description: "A visual wall of Aprivity_'s saved Awwwards frontend inspiration.",
};

export default function FavoritesPage() {
  return <InspirationWallSection />;
}
