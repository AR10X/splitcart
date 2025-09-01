// src/room/RoomContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";
import CartLoader from "../components/CartLoader";

const RoomContext = createContext(null);
export const useRoom = () => useContext(RoomContext);

const initialState = {
  roomId: localStorage.getItem("roomId") || null,
  members: [],
  cart: [],
  fees: {
    delivery: 20,
    packaging: 10,
    tip: 0,
  },
  isCreator: false,
};

// 🔹 helper to resolve display name (prefer sc_name from localStorage)
function getDisplayName(user) {
  const scName = localStorage.getItem("sc_name");
  if (scName) return scName;
  return user?.displayName || user?.name || user?.phone || "Anonymous";
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROOM":
      localStorage.setItem("roomId", action.payload.roomId);
      return {
        ...state,
        roomId: action.payload.roomId,
        isCreator: action.payload.isCreator ?? false,
      };

    case "SET_MEMBERS":
      return { ...state, members: action.payload };

    case "SET_CART":
      return { ...state, cart: action.payload };

    case "SET_FEES":
      return { ...state, fees: action.payload };

    case "EXIT_ROOM":
      localStorage.removeItem("roomId");
      return { ...initialState, roomId: null, members: [] };

    default:
      return state;
  }
}

export function RoomProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 Subscribe to room doc for members, cart, fees
  useEffect(() => {
    if (!state.roomId) return;
    const ref = doc(db, "rooms", state.roomId);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      dispatch({ type: "SET_MEMBERS", payload: data.members || [] });
      dispatch({ type: "SET_CART", payload: data.cart || [] });
      dispatch({ type: "SET_FEES", payload: data.fees || initialState.fees });
    });

    return () => unsub();
  }, [state.roomId]);

  // 🔹 Create a new room
  async function createRoom(code, memberCount) {
    if (!user) throw new Error("User not logged in");
    const ref = doc(db, "rooms", code);

    await setDoc(ref, {
      members: [
        {
          uid: user.uid,
          name: getDisplayName(user),
          paid: false,
        },
      ],
      cart: [],
      fees: initialState.fees,
      memberCount,
      createdAt: Date.now(),
    });

    dispatch({ type: "SET_ROOM", payload: { roomId: code, isCreator: true } });
  }

  // 🔹 Join an existing room
  async function joinRoom(code) {
    if (!user) throw new Error("User not logged in");
    const ref = doc(db, "rooms", code);

    await updateDoc(ref, {
      members: arrayUnion({
        uid: user.uid,
        name: getDisplayName(user),
        paid: false,
      }),
    });

    dispatch({ type: "SET_ROOM", payload: { roomId: code, isCreator: false } });
  }

  // 🔹 Exit current room
  async function exitRoom() {
    if (!user || !state.roomId) return;
    const ref = doc(db, "rooms", state.roomId);

    await updateDoc(ref, {
      members: arrayRemove({
        uid: user.uid,
        name: getDisplayName(user),
        paid: false,
      }),
    });

    dispatch({ type: "EXIT_ROOM" });
  }
  if (state.loading) {
    return <CartLoader message="Joining room..." />;
  }
  return (
    <RoomContext.Provider
      value={{
        state,
        dispatch,
        createRoom,
        joinRoom,
        exitRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
