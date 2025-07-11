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
          {sales.map((sale) => {
            const grouped = sale.items.reduce((acc, item) => {
              if (!acc[item.name]) {
                acc[item.name] = { ...item, quantity: 1 };
              } else {
                acc[item.name].quantity += 1;
                acc[item.name].price += item.price;
              }
              return acc;
            }, {} as Record<string, { name: string; price: number; quantity: number }>);

            const groupedItems = Object.values(grouped);

            return (
              <div key={sale.id} className="bg-white p-4 rounded shadow">
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  Receipt No: {sale.id}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(sale.date).toLocaleString()}
                </div>
                <ul className="mb-2 space-y-1">
                  {groupedItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₱{item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="font-bold text-right">Total: ₱{sale.total}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
