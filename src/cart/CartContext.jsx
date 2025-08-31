import { createContext, useContext, useReducer, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import { useRoom } from "../room/RoomContext";

const initialState = {
  items: [],
  fees: { delivery: 30, packaging: 7, tip: 0 },
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "UPDATE_FEES":
      return {
        ...state,
        fees: { ...state.fees, [action.payload.name]: action.payload.value },
      };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { state: roomState } = useRoom();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 🔹 Subscribe to Firestore items whenever room changes
  useEffect(() => {
    if (!roomState.roomId) return;
    console.log("📡 Subscribing to cart items for room:", roomState.roomId);

    const unsub = onSnapshot(
      collection(db, "rooms", roomState.roomId, "items"),
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("📥 Items updated from Firestore:", items);
        dispatch({ type: "SET_ITEMS", payload: items });
      }
    );

    return () => unsub();
  }, [roomState.roomId]);

  // 🔹 Add or update item
  async function addOrUpdateItem(item, qty) {
  console.log("🟢 addOrUpdateItem CALLED with:", item, "qty:", qty);

  if (!roomState.roomId) {
    console.warn("❌ No roomId — cannot add item");
    return;
  }
  if (!user) {
    console.warn("❌ No user — cannot add item");
    return;
  }

  try {
    const ref = doc(db, "rooms", roomState.roomId, "items", item.productId);
    await setDoc(ref, {
      ...item,
      qty,
      ownerId: user.id,
      ownerName: user.name || user.phone || "Anonymous",
    });
    console.log("✅ Item added/updated in Firestore:", item.title, "qty:", qty);
  } catch (e) {
    console.error("🔥 addOrUpdateItem failed:", e);
  }
}


  // 🔹 Remove item
  async function removeItem(productId) {
    if (!roomState.roomId) {
      console.warn("❌ No roomId — cannot remove item");
      return;
    }
    try {
      await deleteDoc(doc(db, "rooms", roomState.roomId, "items", productId));
      console.log("🗑️ Item removed:", productId);
    } catch (e) {
      console.error("🔥 removeItem failed:", e);
    }
  }

  return (
    <CartCtx.Provider
      value={{ state, dispatch, addOrUpdateItem, removeItem }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// 🔹 Compute totals per user
export function useCartTotals() {
  const { state } = useCart();
  const totalFees =
    state.fees.delivery + state.fees.packaging + state.fees.tip;

  const groups = state.items.reduce((acc, item) => {
    if (!acc[item.ownerId]) {
      acc[item.ownerId] = {
        ownerName: item.ownerName,
        items: [],
        subtotal: 0,
      };
    }
    acc[item.ownerId].items.push(item);
    acc[item.ownerId].subtotal += item.price * item.qty;
    return acc;
  }, {});

  const memberCount = Object.keys(groups).length || 1;
  const feeShare = totalFees / memberCount;

  const perUser = Object.values(groups).map((g) => ({
    ...g,
    total: g.subtotal + feeShare,
  }));

  return { perUser, totalFees, feeShare, groups };
}
