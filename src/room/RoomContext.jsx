import { createContext, useContext, useReducer, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";

const RoomCtx = createContext();

const initialState = {
  roomId: localStorage.getItem("roomId") || null,
  isCreator: false,
  memberCount: 0,
  members: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROOM":
      return { ...state, ...action.payload };
    case "CLEAR_ROOM":
      return { roomId: null, isCreator: false, memberCount: 0, members: [] };
    default:
      return state;
  }
}

export function RoomProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 Persist to localStorage
  useEffect(() => {
    if (state.roomId) {
      localStorage.setItem("roomId", state.roomId);
    } else {
      localStorage.removeItem("roomId");
    }
  }, [state.roomId]);

  // 🔹 Subscribe to room members
  useEffect(() => {
    if (!state.roomId) return;

    const ref = doc(db, "rooms", state.roomId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        dispatch({
          type: "SET_ROOM",
          payload: {
            roomId: state.roomId,
            isCreator: data.isCreator || false,
            memberCount: data.memberCount || 0,
            members: data.members || [],
          },
        });
        console.log("👥 Members updated:", data.members || []);
      }
    });

    return () => unsub();
  }, [state.roomId]);

  // 🔹 Create a new room
  async function createRoom(code, count) {
    if (!user) throw new Error("Must be logged in");

    const ref = doc(db, "rooms", code);
    await setDoc(ref, {
      roomId: code,
      isCreator: true,
      memberCount: count,
      members: [
        { id: user.id, name: user.name || user.phone || "Anonymous" },
      ],
    });

    dispatch({
      type: "SET_ROOM",
      payload: { roomId: code, isCreator: true, memberCount: count },
    });
  }

  // 🔹 Join an existing room
  async function joinRoom(code) {
    if (!user) throw new Error("Must be logged in");

    const ref = doc(db, "rooms", code);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Room not found");

    await updateDoc(ref, {
      members: arrayUnion({
        id: user.id,
        name: user.name || user.phone || "Anonymous",
      }),
    });

    dispatch({
      type: "SET_ROOM",
      payload: { roomId: code, isCreator: false },
    });
  }

  // 🔹 Exit current room
  async function exitRoom() {
    if (state.roomId && user) {
      try {
        const ref = doc(db, "rooms", state.roomId);
        await updateDoc(ref, {
          members: arrayRemove({
            id: user.id,
            name: user.name || user.phone || "Anonymous",
          }),
        });
      } catch (err) {
        console.warn("Exit room update failed:", err.message);
      }
    }

    dispatch({ type: "CLEAR_ROOM" });
    localStorage.removeItem("roomId");
  }

  return (
    <RoomCtx.Provider value={{ state, createRoom, joinRoom, exitRoom }}>
      {children}
    </RoomCtx.Provider>
  );
}

export const useRoom = () => useContext(RoomCtx);
