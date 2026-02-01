import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UrlShortener } from "@/components/UrlShortener";
import { ErrorMessage } from "@/components/ErrorMessage";
import { getTranslations } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const SITE_URL = process.env.FRONTEND_URL ?? "https://lnk.diogopacheco.com";

export const metadata: Metadata = {
  title: "lnk. | URL Shortener",
  description:
    "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free. No signup required.",
  openGraph: {
    title: "lnk. | URL Shortener - Shorten Links Instantly",
    description:
      "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free.",
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const locale =
    ((await cookies()).get("locale")?.value as Locale) ?? "en";
  const t = getTranslations(locale);
  const { error } = await searchParams;
  const errorKey = error ? decodeURIComponent(error) : null;
  const knownErrors = ["missing_url", "invalid_url", "server_error"];
  const errorMessage = errorKey
    ? knownErrors.includes(errorKey)
      ? t(`errors.${errorKey}`)
      : errorKey
    : null;

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
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6 animate-fade-up">
            <Image
              src="https://r2.diogopacheco.com/public/ink-logo-big.png"
              alt="lnk."
              width={300}
              height={177}
              className="w-48 md:w-64 h-auto mx-auto object-contain"
              priority
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {t("home.title")}{" "}
              <span className="gradient-text">{t("home.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("home.subtitle")}
            </p>
          </div>

          <div className="animate-fade-up space-y-4" style={{ animationDelay: "100ms" }}>
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <UrlShortener />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
