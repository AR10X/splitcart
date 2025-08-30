import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import AuthFlow from "./AuthFlow";

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();

  // localStorage is client-only; compute once on mount
  const [hasName, setHasName] = useState(null); // null = unknown
  useEffect(() => {
    setHasName(!!(typeof window !== "undefined" && localStorage.getItem("sc_name")));
  }, []);

  // Until both auth and localStorage are resolved, show a neutral splash
  if (loading || hasName === null) {
    return <div className="min-h-screen grid place-items-center">Loading…</div>;
  }

  // Pass through once both are true
  if (user && hasName) return children;

  return (
    <AuthFlow
      onDone={() => {
        // no hard reload needed; just re-check name
        setHasName(!!localStorage.getItem("sc_name"));
        // when OTP verifies, AuthContext's listener updates `user`, re-rendering this gate.
      }}
    />
  );
}
