export default function ProductCard({ item, onAdd }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="rounded-xl mb-3 w-full h-28 object-cover"
      />
      <div className="text-sm text-gray-500">{item.brand || "—"}</div>
      <div className="font-semibold leading-tight">{item.name}</div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-green-700 font-semibold">₹{item.price}</span>
        <button
          onClick={()=>onAdd(item)}
          className="px-3 py-1.5 text-sm rounded-full bg-green-600 text-white active:scale-95 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
