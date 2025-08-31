import { useParams } from "react-router-dom";
import { useRoom } from "../room/RoomContext";
import LandingPage from "./LandingPage";
import Cart from "./Cart";
import { useEffect } from "react";

export default function CartPage() {
  const { state, joinRoom } = useRoom();
  const { code } = useParams();

  useEffect(() => {
    // 1. If there’s a code in URL → always join that room
    if (code && state.roomId !== code) {
      joinRoom(code).catch((err) =>
        console.error("Failed to join room:", err)
      );
    }
    // 2. Else if no room but we have saved one → rejoin it
    else if (!code && !state.roomId) {
      const saved = localStorage.getItem("roomId");
      if (saved) {
        joinRoom(saved).catch((err) =>
          console.error("Failed to rejoin saved room:", err)
        );
      }
    }
  }, [code, state.roomId, joinRoom]);

  // If no active room → Landing
  if (!state.roomId) {
    return <LandingPage />;
  }

  return <Cart />;
}
