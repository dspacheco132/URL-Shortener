"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isConnectionError =
    error.message?.includes("fetch") ||
    error.message?.includes("network") ||
    error.message?.includes("Failed to fetch");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "hsl(222 47% 6%)",
        color: "hsl(210 40% 98%)",
      }}
    >
      <div
        className="max-w-md w-full text-center rounded-2xl p-8"
        style={{
          background: "hsl(222 47% 8%)",
          border: "1px solid hsl(222 47% 16%)",
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: "hsl(174 72% 56% / 0.2)" }}
        >
          <RefreshCw className="w-8 h-8" style={{ color: "hsl(174 72% 56%)" }} />
        </div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "hsl(210 40% 98%)" }}
        >
          Something went wrong
        </h1>
        <p
          className="text-base mb-6"
          style={{ color: "hsl(215 20% 55%)" }}
        >
          {isConnectionError
            ? "Unable to connect. The service may be temporarily unavailable. Please try again in a moment."
            : "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: "hsl(174 72% 56%)",
              color: "hsl(222 47% 6%)",
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border transition-colors"
            style={{
              borderColor: "hsl(222 47% 16%)",
              color: "hsl(210 40% 98%)",
            }}
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
