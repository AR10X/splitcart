import { useCart } from "../cart/CartContext";

export default function FeesPanel() {
  const { state, dispatch } = useCart();
  const { fees } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const num = Math.max(0, Number(value) || 0); // ensure valid number
    dispatch({
      type: "UPDATE_FEES",
      payload: { name, value: num },
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 mt-3">
      <h2 className="font-semibold text-gray-800">Fees</h2>

      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-600">Delivery</label>
        <input
          type="number"
          min="0"
          name="delivery"
          value={fees.delivery}
          onChange={handleChange}
          className="w-20 px-2 py-1 border rounded text-right"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-600">Packaging</label>
        <input
          type="number"
          min="0"
          name="packaging"
          value={fees.packaging}
          onChange={handleChange}
          className="w-20 px-2 py-1 border rounded text-right"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-600">Tip</label>
        <input
          type="number"
          min="0"
          name="tip"
          value={fees.tip}
          onChange={handleChange}
          className="w-20 px-2 py-1 border rounded text-right"
        />
      </div>
    </div>
  );
}
