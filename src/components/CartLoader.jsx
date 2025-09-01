// src/components/CartLoader.jsx
export default function CartLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-20">
        {/* Wind / speed lines */}
        <div className="absolute left-0 top-4 w-6 h-1 bg-green-400 rounded animate-pulse" />
        <div className="absolute left-0 top-8 w-10 h-1 bg-green-500 rounded animate-pulse delay-150" />
        <div className="absolute left-0 top-12 w-8 h-1 bg-green-300 rounded animate-pulse delay-300" />

        {/* Cart SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0 w-20 h-20 text-green-600 animate-[cartMove_1s_infinite]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="21" r="1.5" fill="currentColor" />
          <circle cx="20" cy="21" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <p className="mt-6 text-gray-700 font-medium">{message}</p>

      {/* Keyframes */}
      <style>{`
        @keyframes cartMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
