"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";

export function Footer() {
  const { t } = useLocaleContext();

  return (
    <footer className="w-full py-8 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          {t("footer.madeBy")}{" "}
          <a
            href="https://diogopacheco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Diogo Pacheco
          </a>
        </p>
      </div>
    </footer>
  );
}
