// src/pages/Cart.jsx
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";
import { useNavigate } from "react-router-dom";
import InviteButton from "../components/InviteButton";
import { useState } from "react";
import CheckoutModal from "../components/CheckoutModal";

export default function Cart() {
  const { state: cartState, addOrUpdateItem, removeItem } = useCart();
  const { user } = useAuth();
  const { state: roomState, exitRoom } = useRoom(); // ✅ reducer style
  const { useCartTotals } = useCart();
  const { perUser, totalFees } = useCartTotals(); 
  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const exitCart = () => {
    exitRoom();
    navigate("/r");
  };

  const updateQty = (item, qty) => {
    if (qty <= 0) {
      removeItem(item.productId);
    } else {
      addOrUpdateItem(item, qty);
    }
  };

  const subtotal = cartState.items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  const grandTotal =
    subtotal +
    cartState.fees.delivery +
    cartState.fees.packaging +
    cartState.fees.tip;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="font-bold text-lg">
          Cart (Room: {roomState.roomId || "—"})
        </h1>
        <button
          onClick={exitCart}
          className="text-red-600 text-sm font-medium"
        >
          Exit Cart
        </button>
      </div>

      {/* Members */}
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="font-semibold text-lg">Members</h2>
        <InviteButton roomId={roomState.roomId} />
      </div>

      {/* Grouped items per user */}
      <div className="flex-1 px-4 space-y-4 pb-40">
        {perUser.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            Cart is empty
          </div>
        ) : (
          perUser.map((group, idx) => {
            const ownerId = group.items[0]?.ownerId;
            const member = roomState.members?.find((m) => m.uid === ownerId); // ✅ fix: Firestore members use uid

            return (
              <div
                key={ownerId || idx}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">
                    {group.ownerName}{" "}
                    {ownerId === user?.uid ? "(You)" : ""}
                  </span>
                  <span
                    className={
                      member?.paid
                        ? "text-green-600 text-sm"
                        : "text-red-500 text-sm"
                    }
                  >
                    {member?.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>

                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center py-2 border-b last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                    </div>

                    {item.ownerId === user?.uid && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-green-50 rounded-full">
                          <button
                            onClick={() =>
                              updateQty(item, item.qty - 1)
                            }
                            className="px-3 py-1 text-green-600 font-bold"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm">{item.qty}</span>
                          <button
                            onClick={() =>
                              updateQty(item, item.qty + 1)
                            }
                            className="px-3 py-1 text-green-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="w-12 text-right font-semibold text-sm">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-2 text-right text-sm font-medium">
                  Subtotal: ₹{group.subtotal} + Fee share: ₹
                  {(totalFees / perUser.length).toFixed(0)} ={" "}
                  <span className="font-bold">₹{group.total}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bill Summary */}
      {cartState.items.length > 0 && (
        <div className="bg-white px-4 py-3 border-t shadow pb-[calc(env(safe-area-inset-bottom)+100px)]">
          <h2 className="font-semibold text-gray-800 mb-2">
            Bill details
          </h2>

          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Items total</span>
            <span className="text-gray-800">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Delivery charge</span>
            <span className="text-gray-800">
              ₹{cartState.fees.delivery}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Packaging charge</span>
            <span className="text-gray-800">
              ₹{cartState.fees.packaging}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Tip</span>
            <span className="text-gray-800">₹{cartState.fees.tip}</span>
          </div>

          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Grand total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            onClick={() => setCheckoutOpen(true)}
            className="w-full mt-3 bg-[#00C853] text-white py-3 rounded-lg font-semibold active:scale-95 transition"
          >
            Checkout
          </button>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
}
