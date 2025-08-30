import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

export default function Cart() {
  const { state, dispatch } = useCart();
  const { user } = useAuth();

  const items = state.items;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const updateQty = (item, qty) => {
    if (qty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
    } else {
      dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* User Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
          {user?.displayName?.[0] || user?.phoneNumber?.[0] || "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-800">
            {user?.displayName || user?.phoneNumber || "User"}
          </div>
          <div className="text-xs text-gray-500">Your cart</div>
        </div>
      </div>

      {/* Items List */}
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
              {/* Left: Image + Info */}
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
                  <div className="text-xs text-gray-500">₹{item.price} each</div>
                </div>
              </div>

              {/* Right: Qty Stepper + Price */}
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

      {/* Sticky Checkout Footer */}
      {items.length > 0 && (
        <div className="bg-white px-4 py-3 shadow-inner">
          <div className="flex justify-between font-semibold text-gray-800 text-base mb-2">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold active:scale-95 transition">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
