import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShortenedUrlProps {
  shortUrl: string;
  originalUrl: string;
}

export function ShortenedUrl({ shortUrl, originalUrl }: ShortenedUrlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-scale-in">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">Your shortened link</p>
              <p className="text-xl font-semibold text-primary truncate font-mono">
                {shortUrl}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="shrink-0"
              >
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground truncate">
              <span className="text-foreground/60">Original:</span>{" "}
              {originalUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
