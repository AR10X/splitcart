// src/components/FeesPanel.jsx
import { useCart } from "../cart/CartContext";

export default function FeesPanel() {
  const { state, dispatch } = useCart();

  const handleChange = (name, value) => {
    dispatch({
      type: "UPDATE_FEES",
      payload: { name, value: Number(value) || 0 },
    });
    console.log(`💰 Fee updated: ${name} → ${value}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <h2 className="font-semibold text-gray-800">Adjust fees</h2>
      <div className="flex justify-between text-sm">
        <label>Delivery</label>
        <input
          type="number"
          value={state.fees.delivery}
          onChange={(e) => handleChange("delivery", e.target.value)}
          className="w-20 border rounded px-2 py-1 text-sm"
        />
      </div>
      <div className="flex justify-between text-sm">
        <label>Packaging</label>
        <input
          type="number"
          value={state.fees.packaging}
          onChange={(e) => handleChange("packaging", e.target.value)}
          className="w-20 border rounded px-2 py-1 text-sm"
        />
      </div>
      <div className="flex justify-between text-sm">
        <label>Tip</label>
        <input
          type="number"
          value={state.fees.tip}
          onChange={(e) => handleChange("tip", e.target.value)}
          className="w-20 border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
}
