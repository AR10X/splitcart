// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuth, logout as fbLogout } from "../lib/firebase";
import CartLoader from "../components/CartLoader";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuth((fbUser) => {
      if (!fbUser) {
        console.log("👤 Auth: no user");
        setUser(null);
        localStorage.removeItem("user");
      } else {
        // ✅ normalize user object
        const scName = localStorage.getItem("sc_name");
        const safeUser = {
          uid: fbUser.uid,
          phone: fbUser.phoneNumber || null,
          name: scName || fbUser.displayName || fbUser.phoneNumber || "Anonymous",
        };

        console.log("👤 Auth user loaded:", safeUser);
        setUser(safeUser);
        localStorage.setItem("user", JSON.stringify(safeUser));
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Ctx.Provider value={{ user, setUser, loading, logout: fbLogout }}>
      {loading ? <CartLoader message="Loading your profile..." /> : children}
    </Ctx.Provider>
  );
}
