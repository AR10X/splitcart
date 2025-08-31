// InviteButton.jsx
export default function InviteButton({ roomId }) {
  const link = `${window.location.origin}/r/${roomId}`;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: "Join my SplitCart", url: link });
    } else {
      await navigator.clipboard.writeText(link);
      alert("Link copied!");
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Invite
    </button>
  );
}
