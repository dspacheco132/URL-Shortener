"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "hsl(222 47% 6%)",
          color: "hsl(210 40% 98%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
            borderRadius: "1rem",
            padding: "2rem",
            background: "hsl(222 47% 8%)",
            border: "1px solid hsl(222 47% 16%)",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "hsl(174 72% 56% / 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RefreshCw
              size={32}
              style={{ color: "hsl(174 72% 56%)" }}
            />
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "hsl(215 20% 55%)",
              marginBottom: "1.5rem",
              lineHeight: 1.5,
            }}
          >
            The app encountered an error. This may happen when the service is
            starting up or temporarily unavailable.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                background: "hsl(174 72% 56%)",
                color: "hsl(222 47% 6%)",
              }}
            >
              <RefreshCw size={18} />
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                border: "1px solid hsl(222 47% 16%)",
                color: "hsl(210 40% 98%)",
                textDecoration: "none",
              }}
            >
              <Home size={18} />
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
