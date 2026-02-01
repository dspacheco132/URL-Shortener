"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import { useLocaleContext } from "@/contexts/LocaleContext";

interface LinkResultProps {
  shortUrl: string;
  longUrl: string | null;
  clicks: number;
}

export function LinkResult({ shortUrl, longUrl, clicks }: LinkResultProps) {
  const { t } = useLocaleContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success(t("toast.copySuccess"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("toast.copyError"));
    }
  };

  return (
    <div className="animate-scale-in">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-lg space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">
                {t("linkResult.label")}
              </p>
              <p className="text-xl font-semibold text-primary truncate font-mono">
                {shortUrl}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {longUrl && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground truncate">
                <span className="text-foreground/60">{t("linkResult.original")}:</span> {longUrl}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {clicks} {t("linkResult.clicks", clicks)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs text-primary hover:underline"
            >
              {t("linkResult.refresh")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
