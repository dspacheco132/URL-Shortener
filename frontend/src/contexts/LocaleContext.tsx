"use client";

import {
  createContext,
  useContext,
  useCallback,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";
import { setLocale as setLocaleAction } from "@/actions/locale";

interface LocaleContextValue {
  locale: Locale;
  t: ReturnType<typeof getTranslations>;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = useCallback(
    (locale: Locale) => {
      startTransition(async () => {
        await setLocaleAction(locale);
        router.refresh();
      });
    },
    [router]
  );

  const value: LocaleContextValue = {
    locale: initialLocale,
    t: getTranslations(initialLocale),
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
      {isPending && (
        <div
          className="fixed inset-0 z-50 bg-background/20 backdrop-blur-[1px] pointer-events-none"
          aria-hidden
        />
      )}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return ctx;
}
