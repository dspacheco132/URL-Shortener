import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Providers } from "@/components/Providers";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

const SITE_URL = process.env.FRONTEND_URL ?? "https://lnk.diogopacheco.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "lnk. | URL Shortener - Shorten Links Instantly",
    template: "%s | lnk.",
  },
  description:
    "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free. No signup required.",
  keywords: [
    "url shortener",
    "link shortener",
    "short url",
    "shorten link",
    "url short",
    "free url shortener",
  ],
  authors: [{ name: "Diogo Pacheco", url: "https://diogopacheco.com" }],
  creator: "Diogo Pacheco",
  publisher: "Diogo Pacheco",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en",
    alternateLocale: "pt",
    url: SITE_URL,
    siteName: "lnk.",
    title: "lnk. | URL Shortener - Shorten Links Instantly",
    description:
      "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "lnk. | URL Shortener - Shorten Links Instantly",
    description:
      "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free.",
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon-32.webp", type: "image/webp", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5eead4",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale =
    ((await cookies()).get("locale")?.value as Locale) ?? "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "lnk.",
              description:
                "Shorten your links instantly. Transform long URLs into short, memorable links. Simple, fast, and free.",
              url: SITE_URL,
            }),
          }}
        />
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
