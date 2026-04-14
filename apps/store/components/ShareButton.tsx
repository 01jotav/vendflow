"use client";

import { useState } from "react";
import { Share2, Check, Link } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return;
      } catch {
        // user cancelled or error — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // last resort
      prompt("Copie o link:", url);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="sm:w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all"
      title={copied ? "Link copiado!" : "Compartilhar"}
    >
      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
    </button>
  );
}
