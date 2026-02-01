"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocaleContext } from "@/contexts/LocaleContext";
import type { Locale } from "@/lib/i18n";

export function Header() {
  const { locale, setLocale } = useLocaleContext();

  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Image
            src="https://r2.diogopacheco.com/public/ink-logo-big.png"
            alt="lnk."
            width={120}
            height={71}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="flex items-center gap-1">
          {(["en", "pt"] as Locale[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLocale(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                locale === lang
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
