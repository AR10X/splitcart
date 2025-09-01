// src/components/CartLoader.jsx
export default function CartLoader({ message = "Placing your order..." }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      {/* Cart SVG with bouncing + spinning wheels */}
      <div className="animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle
            className="animate-spin origin-center"
            cx="9"
            cy="21"
            r="1.5"
            fill="currentColor"
          />
          <circle
            className="animate-spin origin-center"
            cx="20"
            cy="21"
            r="1.5"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="mt-4 text-gray-700 font-medium">{message}</p>
    </div>
  );
}
