import { createContext, useContext, useEffect, useState } from "react";
import { onAuth, logout as fbLogout } from "../lib/firebase";

const Ctx = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    // subscribe to Firebase auth state
    const unsub = onAuth((fbUser) => {
      if (!fbUser) {
        setUser(null);
        localStorage.removeItem("sc_user");
        setLoading(false);
        return;
      }
      const u = {
        id: fbUser.uid,
        phone: fbUser.phoneNumber || "",
        name: localStorage.getItem("sc_name") || "",
      };
      setUser(u);
      localStorage.setItem("sc_user", JSON.stringify(u));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = () => fbLogout();

  return (
    <Ctx.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </Ctx.Provider>
  );
}
