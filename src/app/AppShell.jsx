import BottomBar from "../components/BottomBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  // decide which tab is active
  const current =
    location.pathname.startsWith("/profile")
      ? "profile"
      : location.pathname.startsWith("/r")
      ? "cart"
      : "home";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Outlet /> {/* child pages go here */}
      </div>
      <BottomBar
        current={current}
        onNav={(tab) => {
          if (tab === "home") navigate("/");
          if (tab === "cart") navigate("/r"); // fallback/local cart
          if (tab === "profile") navigate("/profile");
        }}
      />
    </div>
  );
}
