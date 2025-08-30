import { Home, ShoppingCart, User } from "lucide-react";

/**
 * Curved green bottom bar with a floating Cart FAB.
 * Props:
 *  - current: "home" | "cart" | "profile"
 *  - onNav: (tabKey) => void
 *  - cartCount?: number
 */
export default function BottomBar({ current = "home", onNav = () => {}, cartCount = 0 }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="relative h-[70px] pb-[env(safe-area-inset-bottom)]">
        {/* Top scoop with a notch for the floating Cart */}
        <svg
          className="absolute -top-7 left-0 right-0 w-full h-12"
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
        >
          <rect x="0" y="0" width="100" height="24" fill="white" />
          <path
            d="M0,24 C20,24 35,6 50,6 C65,6 80,24 100,24 L100,24 L0,24 Z"
            fill="#00C853"
          />
        </svg>

        {/* Green base */}
        <div className="absolute inset-0 bg-[#00C853] rounded-t-[22px] shadow-[0_-6px_18px_rgba(0,0,0,0.08)]" />

        {/* Side tabs (Home & Profile) */}
        <div className="relative h-full flex items-end justify-between px-10 pb-2 pointer-events-auto">
          <Tab
            active={current === "home"}
            label="Home"
            Icon={Home}
            onClick={() => onNav("home")}
          />
          <Tab
            active={current === "profile"}
            label="Profile"
            Icon={User}
            onClick={() => onNav("profile")}
          />
        </div>

        {/* Center FAB for Cart */}
        <button
          onClick={() => onNav("cart")}
          aria-label="Cart"
          className={[
            "absolute left-1/2 -translate-x-1/2 -top-8",
            "grid place-items-center rounded-full",
            "w-20 h-20 shadow-xl transition-all duration-200",
            current === "cart" ? "bg-white scale-110" : "bg-white scale-100",
            "pointer-events-auto",
          ].join(" ")}
        >
          <ShoppingCart
            size={28}
            strokeWidth={2.4}
            className={current === "cart" ? "text-[#00C853]" : "text-[#00C853]"}
          />
          {/* Badge for cart count */}
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function Tab({ active, label, Icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-16">
      <div
        className={[
          "grid place-items-center w-12 h-12 rounded-full transition-all duration-200",
          active ? "bg-white shadow-md scale-110" : "bg-transparent scale-100",
        ].join(" ")}
      >
        <Icon
          size={22}
          strokeWidth={2}
          className={active ? "text-[#00C853]" : "text-white/90"}
        />
      </div>
      <span
        className={[
          "mt-1 text-[11px] font-medium transition-colors",
          active ? "text-white" : "text-white/80",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
