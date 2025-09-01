// src/cart/CartContext.jsx
import { createContext, useContext, useEffect, useReducer } from "react";
import { useRoom } from "../room/RoomContext";
import { useAuth } from "../auth/AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import CartLoader from "../components/CartLoader";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const initialState = {
  items: [],
  fees: {
    delivery: 20,
    packaging: 10,
    tip: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload };

    case "SET_FEES":
      return { ...state, fees: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { state: roomState } = useRoom();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 Subscribe to Firestore cart + fees
  useEffect(() => {
    if (!roomState.roomId) return;
    const ref = doc(db, "rooms", roomState.roomId);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      dispatch({ type: "SET_CART", payload: data.cart || [] });
      dispatch({ type: "SET_FEES", payload: data.fees || initialState.fees });
    });

    return () => unsub();
  }, [roomState.roomId]);

  // 🔹 Add or update an item in Firestore cart
  async function addOrUpdateItem(item, qty) {
    if (!roomState.roomId || !user?.uid) {
      console.error("❌ Cannot add item: no room or user");
      return;
    }

    const ref = doc(db, "rooms", roomState.roomId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const cart = data.cart || [];

    const existing = cart.find(
      (i) => i.productId === item.productId && i.ownerId === user.uid
    );

    let newCart;
    if (existing) {
      newCart = cart.map((i) =>
        i.productId === item.productId && i.ownerId === user.uid
          ? { ...i, qty }
          : i
      );
    } else {
      newCart = [...cart, { ...item, qty, ownerId: user.uid }];
    }

    await updateDoc(ref, { cart: newCart });
  }

  // 🔹 Remove an item from Firestore cart
  async function removeItem(productId) {
    if (!roomState.roomId || !user?.uid) return;

    const ref = doc(db, "rooms", roomState.roomId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const cart = data.cart || [];

    const newCart = cart.filter(
      (i) => !(i.productId === productId && i.ownerId === user.uid)
    );

    await updateDoc(ref, { cart: newCart });
  }

  // 🔹 Clear cart for everyone (room-level)
  async function clearCart() {
    if (!roomState.roomId) return;
    const ref = doc(db, "rooms", roomState.roomId);
    await updateDoc(ref, { cart: [] });
  }

  // 🔹 Compute per-user totals (with names from RoomContext.members)
  function useCartTotals() {
    const { items, fees } = state;

    const groups = items.reduce((acc, item) => {
      const ownerId = item.ownerId;
      const member = roomState.members.find((m) => m.uid === ownerId);

      if (!acc[ownerId]) {
        acc[ownerId] = {
          ownerId,
          ownerName: member?.name || "Anonymous", // ✅ resolve from Firestore members
          items: [],
          subtotal: 0,
          total: 0,
        };
      }
      acc[ownerId].items.push(item);
      acc[ownerId].subtotal += item.price * item.qty;
      return acc;
    }, {});

    const perUser = Object.values(groups);

    const totalFees =
      (fees.delivery || 0) + (fees.packaging || 0) + (fees.tip || 0);

    const feeShare = perUser.length > 0 ? totalFees / perUser.length : 0;

    perUser.forEach((g) => {
      g.total = g.subtotal + feeShare;
    });

    return { perUser, totalFees };
  }
  if (state.loading) {
    return <CartLoader message="Loading your cart..." />;
  }
  return (
    <CartContext.Provider
      value={{
        state,
        addOrUpdateItem,
        removeItem,
        clearCart,
        useCartTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
