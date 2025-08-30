import { Star } from "lucide-react"; // optional, or use emoji ⭐

export default function ProductCard({ item, onAdd }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.title}
        className="rounded-xl mb-3 w-full h-28 object-cover"
      />

      {/* Category */}
      <div className="text-xs text-gray-400 mb-1">{item.category}</div>

      {/* Title */}
      <div className="font-semibold leading-tight line-clamp-2">{item.title}</div>

      {/* Rating + Delivery */}
      <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span>{item.rating}</span>
          <span>({item.reviews})</span>
        </div>
        <div>{item.deliveryTime}</div>
      </div>

      {/* Price + Add button */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-green-700 font-semibold">₹{item.price}</span>
        <button
          onClick={() => onAdd(item)}
          className="px-3 py-1.5 text-sm rounded-full bg-green-600 text-white active:scale-95 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
