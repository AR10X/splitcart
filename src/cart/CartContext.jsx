import { createContext, useContext, useReducer, useEffect } from "react";

const STORAGE_KEY = "splitcart-cart";

const initialState = {
  items: [],
  fees: {
    delivery: 30,
    packaging: 7,
    tip: 0,
  },
};


function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { productId, ownerId } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.ownerId === ownerId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, id: Date.now().toString(), qty: 1 },
        ],
      };
    }

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "UPDATE_FEES":
      return {
        ...state,
        fees: {
          ...state.fees,
          [action.payload.name]: action.payload.value,
        },
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (init) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : init;
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <CartCtx.Provider value={{ state, dispatch }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function useCartTotals() {
  const { state } = useCart();

  // total fees combined
  const totalFees =
    state.fees.delivery + state.fees.packaging + state.fees.tip;

  // group items by owner
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

  // add fee share to each user’s total
  const perUser = Object.values(groups).map((g) => ({
    ...g,
    total: g.subtotal + feeShare,
  }));

  return { perUser, totalFees, feeShare, groups };
}
