// src/pages/Profile.jsx
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState("Profile");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Prefer sc_name from localStorage
    const scName = localStorage.getItem("sc_name");
    if (scName) {
      setDisplayName(scName);
    } else if (user?.displayName || user?.name) {
      setDisplayName(user.displayName || user.name);
    }

    // TODO: replace with Firestore fetch later
    setOrders([
      { id: "ORD123", item: "Amul Butter 500g", status: "Delivered" },
      { id: "ORD124", item: "Nestle Curd 400g", status: "On the way" },
    ]);
  }, [user]);

  return (
    <div className="pb-16">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* User Info */}
        <h2 className="text-2xl font-semibold mb-1">{displayName}</h2>
        <div className="text-gray-600 mb-6">{user?.phone || "No phone linked"}</div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full rounded bg-[var(--brand)] text-black py-2 mb-6"
        >
          Logout
        </button>

        {/* Orders Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{order.item}</p>
                    <p className="text-sm text-gray-500">#{order.id}</p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
