import { createContext, useContext, useReducer } from "react";

const RoomCtx = createContext(null);

const initialState = {
  roomId: null,     // current room code
  members: [],
  memberCount: 0,      // later will sync with Firestore
  isCreator: false, // true if you created this room
};

function roomReducer(state, action) {
  switch (action.type) {
    case "CREATE_ROOM":
      return {
        ...state,
        roomId: action.payload.roomId,
        isCreator: true,
      };
    case "JOIN_ROOM":
      return {
        ...state,
        roomId: action.payload,
        isCreator: false,
      };
    case "EXIT_ROOM":
      return initialState;
    default:
      return state;
  }
}

export function RoomProvider({ children }) {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  return (
    <RoomCtx.Provider value={{ state, dispatch }}>
      {children}
    </RoomCtx.Provider>
  );
}

export const useRoom = () => {
  const ctx = useContext(RoomCtx);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
};
