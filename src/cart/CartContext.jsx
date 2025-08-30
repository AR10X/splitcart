import { createContext, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";


const Ctx = createContext(null); 
export const useCart = () => useContext(Ctx); 
 
const initial = { 
  room: { 
    roomId: uuidv4(), 
    code: "ABCD12", 
    hostId: null, 
    members: [], 
    items: [], 
    fees: { delivery: 0, packaging: 0, tip: 0 }, 
    status: "BUILDING" 
  } 
}; 
 
function reducer(state, action) { 
  switch (action.type) { 
    case "ADD_ITEM": { 
      const { skuId, ownerId, name, price } = action.payload; 
      const items = [...state.room.items]; 
      const idx = items.findIndex(i => i.skuId === skuId && i.ownerId === ownerId); 
      if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + 1 }; 
      else items.push({ skuId, name, price, qty: 1, ownerId, ownerName: 
action.payload.ownerName, ownerPhone: action.payload.ownerPhone }); 
      return { ...state, room: { ...state.room, items } }; 
    } 
    default: return state; 
  } 
} 
 
export function CartProvider({ children }) { 
  const value = useReducer(reducer, initial); 
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>; 
}