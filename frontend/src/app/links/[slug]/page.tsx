import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkResult } from "@/components/LinkResult";
import { getTranslations } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";
const SITE_URL = process.env.FRONTEND_URL ?? "https://lnk.diogopacheco.com";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ shortUrl?: string; longUrl?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { longUrl: longUrlParam } = await searchParams;
  const pageUrl = `${SITE_URL}/links/${slug}`;

  return {
    title: `Link ${slug}`,
    description: longUrlParam
      ? `Short link for ${longUrlParam}`
      : "Your shortened link is ready to share.",
    robots: { index: false, follow: true },
    openGraph: {
      title: `Link ${slug} | lnk.`,
      description: "Your shortened link is ready to share.",
      url: pageUrl,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function LinkPage({ params, searchParams }: PageProps) {
  const locale =
    ((await cookies()).get("locale")?.value as Locale) ?? "en";
  const t = getTranslations(locale);
  const { slug } = await params;
  const { shortUrl: shortUrlParam, longUrl: longUrlParam } = await searchParams;

  const statsRes = await fetch(`${BACKEND_URL}/stats/${slug}`, {
    next: { revalidate: 10 },
  });

  if (!statsRes.ok) {
    notFound();
  }

  const stats = await statsRes.json();
  const clicks = stats.clicks ?? 0;

  const shortUrl = shortUrlParam ?? `${BACKEND_URL.replace(/\/$/, "")}/${slug}`;
  const longUrl = longUrlParam ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174 72% 56% / 0.12), transparent)",
        }}
      />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center animate-fade-up">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {t("linkPage.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("linkPage.subtitle")}
            </p>
          </div>

          <LinkResult
            shortUrl={shortUrl}
            longUrl={longUrl}
            clicks={clicks}
          />

          <div className="text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Link
              href="/"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              {t("linkPage.backLink")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
