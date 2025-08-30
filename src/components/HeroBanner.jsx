export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
      <div className="max-w-[70%]">
        <div className="text-xs uppercase tracking-wide/loose opacity-90">Today only</div>
        <h3 className="text-xl font-semibold leading-snug mt-1">40% OFF on fresh veggies</h3>
        <p className="text-xs mt-1 opacity-90">Free delivery above ₹299</p>
        <button className="mt-3 px-4 py-2 rounded-full bg-white text-green-600 text-sm font-medium">
          Shop now
        </button>
      </div>
      {/* Decorative blob */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/15" />
    </div>
  );
}
