import { useCart } from "../cart/CartContext";
import { useRoom } from "../room/RoomContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ item }) {
  const { state: cartState, addOrUpdateItem } = useCart();
  const { state } = useRoom();         // ✅ get state object
  const roomId = state.roomId;         // ✅ extract roomId correctly
  const { user } = useAuth();
  const navigate = useNavigate();

  // check if already in cart
  const cartItem = cartState.items.find(
    (i) => i.productId === item.id && i.ownerId === (user?.id || "guest")
  );

  const addToCart = () => {
    console.log("🟡 Add button clicked for:", item.title);

    if (!roomId) {
      console.warn("⚠️ No roomId → navigating to /r");
      navigate("/r");
      return;
    }

    if (cartItem) {
      console.log("ℹ️ Already in cart, skipping:", item.title);
      return;
    }

    addOrUpdateItem(
      {
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        ownerId: user?.id || "guest",
        ownerName: user?.name || "Guest",
      },
      1
    );
  };

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* product image */}
      <img
        src={item.image}
        alt={item.title}
        className="rounded-xl mb-3 w-full h-28 object-cover"
      />

      {/* title */}
      <div className="font-semibold">{item.title}</div>

      {/* price + add button */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-green-700 font-semibold">₹{item.price}</span>

        <button
          onClick={addToCart}
          className={`px-3 py-1.5 text-sm rounded-full transition active:scale-95 ${
            cartItem
              ? "bg-white border border-green-600 text-green-600 cursor-default"
              : "bg-green-600 text-white"
          }`}
        >
          {cartItem ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}
