// src/pages/CartPage.jsx
import { useParams } from "react-router-dom";
import { useRoom } from "../room/RoomContext";
import LandingPage from "./LandingPage";
import Cart from "./Cart";

export default function CartPage() {
  const { code } = useParams();
  const { state: roomState } = useRoom(); // ✅ reducer style

  console.log("CartPage render:", { roomId: roomState.roomId, code });

  // If no room joined yet AND no room code in URL → show Landing
  if (!roomState.roomId && !code) {
    return <LandingPage />;
  }

  // If there’s a room (joined or via URL param) → show Cart
  return <Cart />;
}
