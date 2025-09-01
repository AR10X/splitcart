// src/components/GreetingBar.jsx
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

export default function GreetingBar() {
  const { user } = useAuth();
  const { state: cartState } = useCart();

  // Time-based greeting
  const hours = new Date().getHours();
  let timeGreeting = "Hello";
  if (hours < 12) timeGreeting = "Good morning";
  else if (hours < 18) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  return (
    <div className="flex justify-between items-center px-4 py-3">
      <div>
        <h2 className="text-lg font-semibold">
          {timeGreeting}, {user?.name?.split(" ")[0] || "Friend"} 👋
        </h2>
        <p className="text-sm text-gray-500">
          {cartState.items.length > 0
            ? "Your cart is waiting 🛒"
            : "What’s cooking today? 🍳"}
        </p>
      </div>
      {/* <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
        {user?.name?.[0] || "U"}
      </div> */}
    </div>
  );
}
