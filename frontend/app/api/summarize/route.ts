import { NextRequest, NextResponse } from "next/server";

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // стандартний YouTube URL
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    // короткий формат youtu.be
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const youtubeUrl = body?.youtubeUrl;

    if (!youtubeUrl || typeof youtubeUrl !== "string") {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Video ID extracted successfully",
      videoId,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}