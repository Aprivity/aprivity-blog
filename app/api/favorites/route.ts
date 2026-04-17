import { NextResponse } from "next/server";
import { getUnifiedFavorites } from "@/lib/favorites-aggregator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await getUnifiedFavorites();

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[favorites] Aggregated API route failed unexpectedly", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: "error",
        all: [],
        groups: {
          awwwards: [],
          github: [],
        },
        counts: {
          awwwards: 0,
          github: 0,
          total: 0,
        },
        sources: {
          awwwards: {
            status: "error",
            isStale: false,
            message: "Awwwards source did not return a usable response.",
          },
          github: {
            status: "error",
            isStale: false,
            message: "GitHub source did not return a usable response.",
          },
        },
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }
}
