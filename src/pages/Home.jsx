import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import data from "../data/groceries.json";
import HeroBanner from "../components/HeroBanner";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react"; // add this at the top

export default function Home() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  function handleAdd(item){
    // Day-1: just prove ownership (Day-2 we dispatch to CartContext)
    console.log("ADD_ITEM", {
      skuId: item.id, name: item.name, price: item.price,
      ownerId: user.id, ownerPhone: user.phone, ownerName: user.name || "",
      qty: 1
    });
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter(it => {
      const matchQ = !query || it.name.toLowerCase().includes(query);
      const matchCat = cat === "all" || (it.cat || "misc") === cat;
      return matchQ && matchCat;
    });
  }, [q, cat]);

  return (
    <div className="pb-28">
      {/* Top bar: greeting + avatar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="w-8 h-8 rounded-full bg-green-100 grid place-items-center text-green-700 font-semibold">
              {(user?.name || user?.phone || "U").slice(0,1).toUpperCase()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 
                          outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-400"
                placeholder="Search for milk, bread, fruits…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <CategoryChips value={cat} onChange={setCat} />
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4">
        <HeroBanner />
      </div>

      {/* “Recommended for you” */}
      <Section title="Recommended for you">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(it => (
            <ProductCard key={it.id} item={it} onAdd={handleAdd} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}
