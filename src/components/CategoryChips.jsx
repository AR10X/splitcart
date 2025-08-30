const CATS = [
  { id: "all", name: "All", emoji: "🛒", category: "all" },
  { id: "veg", name: "Vegetables", emoji: "🥦", category: "Vegetables" },
  { id: "fruits", name: "Fruits", emoji: "🍎", category: "Fruits" },
  { id: "dairy", name: "Dairy", emoji: "🥛", category: "Dairy" },
  { id: "bakery", name: "Bakery", emoji: "🥖", category: "Bakery" },
  { id: "snacks", name: "Snacks", emoji: "🍪", category: "Snacks" },
  { id: "beverages", name: "Beverages", emoji: "🥤", category: "Beverages" },
  { id: "groceries", name: "Groceries", emoji: "🛍️", category: "Groceries" },
  { id: "household", name: "Household", emoji: "🧹", category: "Household" },
  { id: "personal-care", name: "Personal Care", emoji: "🧴", category: "Personal Care" }
];

export default function CategoryChips({ value = "all", onChange = () => {} }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
      {CATS.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.category)} // 🔑 return real category name
            className={[
              "shrink-0 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200",
              active
                ? "bg-green-600 text-white border-green-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600"
            ].join(" ")}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
