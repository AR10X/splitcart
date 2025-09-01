// src/components/CheckoutModal.jsx
import { useRoom } from "../room/RoomContext";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";
import { db } from "../lib/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function CheckoutModal({ onClose }) {
  const { state: roomState } = useRoom();
  const { state: cartState, useCartTotals } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { perUser, totalFees } = useCartTotals();
  const [myShare, setMyShare] = useState(0);

  // ✅ Find my share
  useEffect(() => {
    const me = perUser.find((g) => g.ownerId === user?.uid);
    if (me) setMyShare(me.total);
  }, [perUser, user]);

  const me = roomState.members.find((m) => m.uid === user?.uid);
  const allPaid =
    roomState.members.length > 0 && roomState.members.every((m) => m.paid);

  // ✅ When allPaid → create order once + show confetti
  useEffect(() => {
    if (allPaid && roomState.roomId) {
      (async () => {
        const orderRef = doc(db, "orders", roomState.roomId); // ✅ one order per room
        const snap = await getDoc(orderRef);

        if (!snap.exists()) {
          await setDoc(orderRef, {
            roomId: roomState.roomId,
            items: cartState.items,
            total:
              cartState.items.reduce((s, i) => s + i.price * i.qty, 0) +
              totalFees,
            createdAt: Date.now(),
            members: roomState.members,
            memberIds: roomState.members.map((m) => String(m.uid)),
            status: "Placed",
          });
        }

        // 🎉 Confetti for everyone
        confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });

        // Redirect
        setTimeout(() => navigate("/profile"), 2000);
      })();
    }
  }, [
    allPaid,
    cartState.items,
    navigate,
    roomState.members,
    roomState.roomId,
    totalFees,
  ]);

  // ✅ Confirm payment for current user
  async function confirmPayment() {
    if (!roomState.roomId || !user?.uid) return;
    const ref = doc(db, "rooms", roomState.roomId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const newMembers = data.members.map((m) =>
      m.uid === user.uid ? { ...m, paid: true } : m
    );

    await updateDoc(ref, { members: newMembers });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        {/* My bill share */}
        <div className="flex justify-between mb-4">
          <span className="font-medium">Your share</span>
          <span className="font-bold text-lg">₹{myShare}</span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {me?.paid
            ? allPaid
              ? "All members have paid! Redirecting..."
              : "You have paid. Waiting for others to complete payment..."
            : "Confirm your payment. Once all members have paid, your order will be placed."}
        </p>

        {/* Buttons */}
        {!me?.paid && !allPaid && (
          <button
            onClick={confirmPayment}
            className="w-full bg-[#00C853] text-white py-3 rounded-lg font-semibold active:scale-95 transition"
          >
            Confirm Payment
          </button>
        )}

        {me?.paid && !allPaid && (
          <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium text-center">
            Waiting for others to pay...
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
