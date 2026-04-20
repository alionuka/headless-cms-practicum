import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Innertube } from "youtubei.js";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const dynamic = "force-dynamic";

const STRAPI_URL = "http://127.0.0.1:1337";

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

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
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

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

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    const title = info.basic_info?.title || "Untitled video";

    const prompt = `
You are a helpful assistant.
Create a short, clear summary for a YouTube video.

Video title: ${title}
Video ID: ${videoId}

Write:
1. A short summary
2. 3 key points
3. A one-line conclusion
`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    const summaryText = result.text;

    const strapiRes = await fetch(`${STRAPI_URL}/api/summaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
          videoId,
          content: summaryText,
        },
      }),
    });

    const strapiData = await strapiRes.json();

    console.log("STRAPI SUMMARY SAVE RESPONSE:", strapiData);

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: strapiData?.error?.message || "Failed to save summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Summary generated and saved successfully",
      videoId,
      title,
      summary: summaryText,
      savedSummary: strapiData?.data,
    });
  } catch (error) {
    console.error("TRANSCRIPT ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}