import { useCart } from "../cart/CartContext";
import { useRoom } from "../room/RoomContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ item }) {
  const { state: cartState, dispatch } = useCart();
  const { state: room } = useRoom();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if item already in cart
  const cartItem = cartState.items.find(
    (i) => i.productId === item.id && i.ownerId === (user?.id || "guest")
  );

  const addToCart = () => {
    // If no room joined yet → go to /r (LandingPage)
    if (!room.roomId) {
      navigate("/r");
      return;
    }

    // If already added, do nothing (quantities managed in Cart page)
    if (cartItem) return;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        ownerId: user?.id || "guest",
        ownerName: user?.name || "Guest",
      },
    });
  };

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Product UI */}
      <img
        src={item.image}
        alt={item.title}
        className="rounded-xl mb-3 w-full h-28 object-cover"
      />
      <div className="font-semibold">{item.title}</div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-green-700 font-semibold">₹{item.price}</span>

        {/* Add / Added button */}
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
