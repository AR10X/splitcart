// src/components/InviteButton.jsx
import { useState } from "react";

export default function InviteButton({ roomId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomId) return;
    const url = `${window.location.origin}/r/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    console.log("🔗 Invite link copied:", url);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!roomId}
      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow active:scale-95 disabled:opacity-50"
    >
      {copied ? "Copied!" : "Invite"}
    </button>
  );
}
