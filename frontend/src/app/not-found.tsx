import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default async function NotFound() {
  const locale =
    ((await cookies()).get("locale")?.value as Locale) ?? "en";
  const t = getTranslations(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {t("notFound.title")}
        </p>
        <Link
          href="/"
          className="text-primary underline hover:text-primary/90"
        >
          {t("notFound.backLink")}
        </Link>
      </div>
    </div>
  );
}
