import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AuthGate from "./pages/AuthGate";
import { CartProvider } from "./cart/CartContext";
import { RoomProvider } from "./room/RoomContext";
import AppShell from "./app/AppShell";

// Pages
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";   // wrapper (Landing vs Cart)
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <RoomProvider>
          <CartProvider>
            <Routes>
              <Route element={<AppShell />}>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Cart flow */}
                <Route path="/r" element={<CartPage />} />        {/* Landing first */}
                <Route path="/r/:code" element={<CartPage />} />  {/* Cart with code */}

                {/* Profile */}
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </CartProvider>
        </RoomProvider>
      </AuthGate>
    </AuthProvider>
  );
}
