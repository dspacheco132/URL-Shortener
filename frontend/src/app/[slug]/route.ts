import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

const RESERVED_PATHS = ["links", "shorten", "api"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (RESERVED_PATHS.includes(slug) || slug.includes(".")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/${slug}`, {
      redirect: "manual",
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("Location");
      if (location) {
        return NextResponse.redirect(location, 307);
      }
    }

    if (res.status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
    });
  } catch (error) {
    console.error("Redirect proxy error:", error);
    return NextResponse.json(
      { error: "Failed to resolve link" },
      { status: 500 }
    );
  }
}
