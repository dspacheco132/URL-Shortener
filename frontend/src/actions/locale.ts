"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function setLocale(locale: Locale) {
  (await cookies()).set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
}
