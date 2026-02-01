import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:8080";

function getBaseUrl(request: NextRequest): string {
  return FRONTEND_URL.replace(/\/$/, "");
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);

  try {
    const formData = await request.formData();
    const url = formData.get("url");

    if (!url || typeof url !== "string") {
      return NextResponse.redirect(new URL(`/?error=missing_url`, baseUrl));
    }

    const trimmed = url.trim();
    const urlToShorten = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    if (!isValidUrl(urlToShorten)) {
      return NextResponse.redirect(new URL(`/?error=invalid_url`, baseUrl));
    }

    const res = await fetch(`${BACKEND_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlToShorten }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = encodeURIComponent(data.error ?? "Failed to shorten URL");
      return NextResponse.redirect(new URL(`/?error=${errorMsg}`, baseUrl));
    }

    const redirectUrl = new URL(`/links/${data.slug}`, baseUrl);
    redirectUrl.searchParams.set("shortUrl", data.shortUrl);
    redirectUrl.searchParams.set("longUrl", data.longUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Shorten error:", error);
    return NextResponse.redirect(new URL("/?error=server_error", baseUrl));
  }
}
