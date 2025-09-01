// src/pages/Profile.jsx
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("memberIds", "array-contains", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(list);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-700">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <div className="text-gray-500 text-sm">{user?.phone}</div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>

        {/* Orders */}
        <h3 className="text-lg font-semibold mb-3">Your Orders</h3>
        {orders.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No orders yet. Start shopping!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    Order #{order.id.slice(-6)}
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Out for Delivery"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status || "Placed"}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  {new Date(order.createdAt).toLocaleString()}
                </div>

                {/* Tracking timeline */}
                <div className="flex items-center justify-between mb-4">
                  {["Placed", "Out for Delivery", "Delivered"].map(
                    (step, idx) => {
                      const isActive =
                        step === order.status ||
                        (step === "Placed" && !order.status); // default
                      const isCompleted =
                        (order.status === "Out for Delivery" && idx <= 1) ||
                        (order.status === "Delivered" && idx <= 2);

                      return (
                        <div key={step} className="flex-1 flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCompleted || isActive
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          {idx < 2 && (
                            <div
                              className={`flex-1 h-1 ${
                                isCompleted ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Items preview */}
                <div className="divide-y">
                  {order.items.slice(0, 3).map((i, idx) => (
                    <div
                      key={idx}
                      className="py-2 flex justify-between text-sm"
                    >
                      <span className="truncate">{i.title}</span>
                      <span className="font-medium">₹{i.price * i.qty}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="py-2 text-sm text-gray-400">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
