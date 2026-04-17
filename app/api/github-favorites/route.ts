import { NextResponse } from "next/server";
import { fetchGitHubFavorites } from "@/lib/github-favorites";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await fetchGitHubFavorites();

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[github-favorites] API route failed unexpectedly", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: "error",
        items: [],
        sourceUrl: "https://api.github.com/users/Aprivity/starred",
        isStale: false,
        message: "Unable to load public GitHub starred repositories right now.",
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
