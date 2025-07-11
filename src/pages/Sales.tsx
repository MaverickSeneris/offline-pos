import { useEffect, useState } from "react";

type Sale = {
  id: number;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  tax?: number;
  cash?: number;
  change?: number;
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

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return;

    const updatedSales = sales.filter((sale) => sale.id !== id);
    setSales(updatedSales);
    localStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
  };
  

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="mb-4 flex gap-4">
        <a href="/" className="text-blue-600 underline">
          ← Back to POS
        </a>
        <a href="/products" className="text-blue-600 underline">
          Manage Products
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {sales.length === 0 ? (
        <p className="text-gray-500">No sales yet.</p>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-500">
                  Receipt #: {sale.id} <br />
                  {new Date(sale.date).toLocaleString()}
                </div>
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="bg-red-500 text-black px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-1">
                Receipt #: {sale.id}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(sale.date).toLocaleString()}
              </div>
              <ul className="mb-2 space-y-1">
                {sale.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-sm text-right">
                Subtotal: ₱{(sale.total ?? 0).toFixed(2)} <br />
                Tax (12%): ₱{(sale.tax ?? 0).toFixed(2)} <br />
                <strong>
                  Total: ₱{((sale.total ?? 0) + (sale.tax ?? 0)).toFixed(2)}
                </strong>
                <br />
                Cash: ₱{(sale.cash ?? 0).toFixed(2)} <br />
                Change: ₱{(sale.change ?? 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
