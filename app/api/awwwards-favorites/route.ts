import { NextResponse } from "next/server";
import { awwwardsCollectionUrl } from "@/lib/awwwards-favorites";
import { scrapeAwwwardsFavorites } from "@/lib/scrape-awwwards";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await scrapeAwwwardsFavorites();

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[awwwards] API route failed unexpectedly", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: "error",
        items: [],
        sourceUrl: awwwardsCollectionUrl,
        message: "Unable to load the latest favorites right now",
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
