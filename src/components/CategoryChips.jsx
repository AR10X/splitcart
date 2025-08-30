const CATS = [
  { id:"all", name:"All", emoji:"🛒" },
  { id:"veg", name:"Vegetables", emoji:"🥦" },
  { id:"fruits", name:"Fruits", emoji:"🍊" },
  { id:"dairy", name:"Dairy", emoji:"🥛" },
  { id:"bakery", name:"Bakery", emoji:"🥖" },
  { id:"snacks", name:"Snacks", emoji:"🍪" },
];

export default function CategoryChips({ value="all", onChange=()=>{} }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
      {CATS.map(c => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={()=>onChange(c.id)}
            className={[
              "shrink-0 px-3 py-1.5 rounded-full border text-sm transition",
              active
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-200"
            ].join(" ")}
          >
            <span className="mr-1">{c.emoji}</span>{c.name}
          </button>
        );
      })}
    </div>
  );
}
