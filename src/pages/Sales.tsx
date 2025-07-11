import { useEffect, useState } from "react";

type Sale = {
  id: number;
  date: string;
  items: { name: string; price: number }[];
  total: number;
};

const SALES_KEY = "vendure_sales";

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SALES_KEY);
    if (stored) {
      setSales(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="mb-4">
        <a href="/" className="text-blue-600 underline">
          ← Back to POS
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {sales.length === 0 ? (
        <p className="text-gray-500">No sales yet.</p>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500 mb-2">
                {new Date(sale.date).toLocaleString()}
              </div>
              <ul className="mb-2 space-y-1">
                {sale.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>₱{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold text-right">Total: ₱{sale.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
