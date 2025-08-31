import { useParams } from "react-router-dom";
import { useRoom } from "../room/RoomContext";
import LandingPage from "./LandingPage";
import Cart from "./Cart";

export default function CartPage() {
  const { state } = useRoom();
  const { code } = useParams();

  // If no room joined yet → Landing UI
  if (!state.roomId && !code) {
    return <LandingPage />;
  }

  // If code in URL or already in room → show cart
  return <Cart />;
}
