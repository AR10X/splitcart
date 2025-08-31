import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";
import { useNavigate } from "react-router-dom";
import InviteButton from "../components/InviteButton";

export default function Cart() {
  const { state: cartState, addOrUpdateItem, removeItem } = useCart(); // ✅ Firestore methods
  const { state } = useRoom();
  const roomId = state.roomId;
  const members = state.members || [];
  const { user } = useAuth();
  const navigate = useNavigate();

  const exitCart = () => {
    localStorage.removeItem("roomId");
    navigate("/r"); // back to LandingPage
  };

  const items = cartState.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const updateQty = (item, qty) => {
    if (qty <= 0) {
      removeItem(item.productId);
    } else {
      addOrUpdateItem(item, qty);
    }
  };

  const grandTotal =
    subtotal +
    cartState.fees.delivery +
    cartState.fees.packaging +
    cartState.fees.tip;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="font-bold text-lg">Cart (Room: {roomId || "—"})</h1>
        <button
          onClick={exitCart}
          className="text-red-600 text-sm font-medium"
        >
          Exit Cart
        </button>
      </div>

      {/* Members */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="font-semibold text-lg">Members</h2>
        <InviteButton roomId={roomId} />
      </div>

      <div className="flex gap-3 mb-4 px-4 flex-wrap">
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm">No members yet</p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                {m.name?.[0] ?? "?"}
              </div>
              <span>
                {m.name} {m.id === user.id ? "(You)" : ""}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Cart is empty
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    ₹{item.price} each
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-green-50 rounded-full shadow-sm">
                  <button
                    onClick={() => updateQty(item, item.qty - 1)}
                    className="px-3 py-1 text-green-600 font-bold text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="px-2 text-sm font-medium text-gray-800">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item, item.qty + 1)}
                    className="px-3 py-1 text-green-600 font-bold text-lg leading-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-semibold text-gray-800 min-w-[40px] text-right">
                  ₹{item.price * item.qty}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Details */}
      {items.length > 0 && (
        <div
          className="bg-white px-4 py-3 border-t shadow-[0_-2px_6px_rgba(0,0,0,0.05)] 
                pb-[calc(env(safe-area-inset-bottom)+130px)]"
        >
          <h2 className="font-semibold text-gray-800 mb-2">Bill details</h2>

          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Items total</span>
            <span className="text-gray-800">₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Delivery charge</span>
            <span className="text-gray-800">{cartState.fees.delivery}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Packaging charge</span>
            <span className="text-gray-800">{cartState.fees.packaging}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Tip</span>
            <span className="text-gray-800">{cartState.fees.tip}</span>
          </div>

          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Grand total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button className="w-full mt-3 bg-[#00C853] text-white py-3 rounded-lg font-semibold active:scale-95 transition">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
