import { ChevronDown, MapPin, Mic, Search, Bell } from "lucide-react";

const QUICK = [
  { id: "veg", label: "Veggies" },
  { id: "fruits", label: "Fruits" },
  { id: "dairy", label: "Dairy" },
  { id: "snacks", label: "Snacks" },
];

export default function HomeHeader({ q, onQ, userInitial = "U", onLocationClick }) {
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-5xl mx-auto px-4 pt-3 pb-3">
        {/* Row 1: Location / ETA + actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onLocationClick}
            className="flex items-center gap-2 text-left"
          >
            <div className="h-9 w-9 rounded-full bg-green-100 text-green-700 grid place-items-center">
              <MapPin size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-[11px] text-gray-500">Deliver to</div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">Home • 18–25 min</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button className="relative h-9 w-9 rounded-full grid place-items-center bg-gray-100 text-gray-700">
              <Bell size={18} />
              {/* unread dot */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-green-100 text-green-700 grid place-items-center font-semibold">
              {userInitial}
            </div>
          </div>
        </div>

        {/* Row 2: Search pill */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={q}
              onChange={(e) => onQ(e.target.value)}
              className="w-full rounded-full bg-gray-100 border border-gray-200 pl-10 pr-11 py-2.5 outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Search for milk, bread, fruits…"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full grid place-items-center bg-white border hover:bg-gray-50"
              aria-label="Voice search"
            >
              <Mic size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Row 3: Quick chips */}
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK.map((c) => (
            <button
              key={c.id}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-green-500 hover:text-green-700 transition"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* subtle bottom shadow like Blinkit */}
      <div className="h-3 bg-gradient-to-b from-black/5 to-transparent" />
    </div>
  );
}
