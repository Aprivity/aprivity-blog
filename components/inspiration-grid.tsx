"use client";

import { InspirationCard } from "@/components/inspiration-card";
import type { UnifiedFavoriteItem } from "@/lib/favorite-types";

type InspirationGridProps = {
  items: UnifiedFavoriteItem[];
  layout?: "gallery" | "github";
};

export function InspirationGrid({ items, layout = "gallery" }: InspirationGridProps) {
  const gridClassName =
    layout === "github"
      ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

  return (
    <div className={gridClassName}>
      {items.map((item, index) => (
        <InspirationCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
