import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: Date;
}

interface RecentLinksProps {
  links: Link[];
  onDelete: (id: string) => void;
}

export function RecentLinks({ links, onDelete }: RecentLinksProps) {
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (links.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Links</h2>
      <div className="space-y-3">
        {links.map((link, index) => (
          <div
            key={link.id}
            className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary truncate font-mono text-sm">
                  {link.shortUrl}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {link.originalUrl}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(link.shortUrl)}
                  className="h-8 w-8"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8"
                >
                  <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(link.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
