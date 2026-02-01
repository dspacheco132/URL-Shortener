"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, ArrowRight, Loader2 } from "lucide-react";
import { useLocaleContext } from "@/contexts/LocaleContext";

export function UrlShortener() {
  const { t } = useLocaleContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const input = form.elements.namedItem("url") as HTMLInputElement;
    const value = input?.value?.trim() ?? "";

    if (!value) return;

    try {
      const urlToShorten = value.startsWith("http") ? value : `https://${value}`;
      new URL(urlToShorten);
      if (input) input.value = urlToShorten;
      setIsSubmitting(true);
    } catch {
      e.preventDefault();
    }
  };

  return (
    <form
      action="/shorten"
      method="POST"
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative flex items-center gap-3 p-2 bg-card rounded-2xl border border-border shadow-lg shadow-background/50 gradient-border">
        <div className="flex items-center gap-3 flex-1 pl-4">
          <Link2 className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            name="url"
            placeholder={t("form.placeholder")}
            defaultValue=""
            className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12"
            required
          />
        </div>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t("form.submit")}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
