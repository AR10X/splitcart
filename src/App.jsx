import { AuthProvider } from "./auth/AuthContext";
import AuthGate from "./pages/AuthGate";
import AppShell from "./app/AppShell";
import { CartProvider } from "./cart/CartContext";

export default function App(){
  return (
    <AuthProvider> 
      <AuthGate> 
        <CartProvider> 
          <AppShell /> 
        </CartProvider> 
      </AuthGate> 
    </AuthProvider> 
  );
}
