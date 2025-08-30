import { createContext, useContext, useReducer } from "react";

// --------------------
// Initial State
// --------------------
const initialState = {
  items: [], // { id, sku, name, price, ownerId, ownerName, qty }
};

// --------------------
// Reducer
// --------------------
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


    case "UPDATE_QTY": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    }

    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

// --------------------
// Context + Hook
// --------------------
const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
