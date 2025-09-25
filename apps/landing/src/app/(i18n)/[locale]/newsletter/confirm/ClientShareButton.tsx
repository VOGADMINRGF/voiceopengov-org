"use client";

import { useState, useCallback } from "react";

type Props = {
  text: string;
  url: string;
};

export default function ClientShareButton({ text, url }: Props) {
  const [copied, setCopied] = useState(false);

  const onShare = useCallback(async () => {
    try {
      if (navigator && "share" in navigator) {
        await (navigator as any).share({ title: "VoiceOpenGov", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // no-op
    }
  }, [text, url]);

  return (
    <button
      onClick={onShare}
      className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
      aria-label="Seite teilen"
    >
      {copied ? "Link kopiert ✓" : "Weiterempfehlen"}
    </button>
  );
}
