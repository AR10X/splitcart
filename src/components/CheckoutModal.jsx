import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function CheckoutModal({ onClose, perUser }) {
  const { user } = useAuth();
  const { state: room } = useRoom();

  const myTotal = perUser.find((g) => g.ownerName === (user.displayName || user.phoneNumber));

  const handlePay = async () => {
    if (!user?.uid || !room.roomId) return;
    try {
      const ref = doc(db, "rooms", room.roomId);
      await updateDoc(ref, {
        paid: arrayUnion(user.uid),
      });
      console.log("💸 Marked as paid:", user.uid);
      onClose();
    } catch (e) {
      console.error("🔥 Payment update failed:", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Checkout</h2>
        <p className="mb-2">
          Your share:{" "}
          <span className="font-semibold text-green-700">
            ₹{myTotal?.total.toFixed(0)}
          </span>
        </p>
        <button
          onClick={handlePay}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold mb-2"
        >
          Pay
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
