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
  const [fromDate, setFromDate] = useState(""); // Filter start date
  const [toDate, setToDate] = useState(""); // Filter end date

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

  // 🔍 Filter sales by selected date range
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date).toISOString().slice(0, 10);
    return (
      (!fromDate || saleDate >= fromDate) && (!toDate || saleDate <= toDate)
    );
  });

  // 🎯 Preset filter functions
  const setToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFromDate(today);
    setToDate(today);
  };

  const setThisWeek = () => {
    const now = new Date();
    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay());
    const last = new Date(first);
    last.setDate(first.getDate() + 6);

    setFromDate(first.toISOString().slice(0, 10));
    setToDate(last.toISOString().slice(0, 10));
  };

  const setThisMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(first.toISOString().slice(0, 10));
    setToDate(last.toISOString().slice(0, 10));
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
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

      <h1 className="text-2xl font-bold mb-2">Sales History</h1>

      {/* 📆 Filter UI with presets */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <label className="text-sm font-semibold">From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-1 rounded"
        />
        <label className="text-sm font-semibold">To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-1 rounded"
        />
        <button
          onClick={setToday}
          className="text-sm bg-gray-200 px-2 py-1 rounded"
        >
          Today
        </button>
        <button
          onClick={setThisWeek}
          className="text-sm bg-gray-200 px-2 py-1 rounded"
        >
          This Week
        </button>
        <button
          onClick={setThisMonth}
          className="text-sm bg-gray-200 px-2 py-1 rounded"
        >
          This Month
        </button>
        <button
          onClick={clearFilter}
          className="text-sm bg-gray-300 px-2 py-1 rounded"
        >
          All Time
        </button>
      </div>

      {filteredSales.length === 0 ? (
        <p className="text-gray-500">No sales in this range.</p>
      ) : (
        <div className="space-y-6">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white p-4 rounded shadow font-mono text-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div>Vendure Mart</div>
                  <div>123 National Rd, Rizal, Laguna</div>
                  <div>Email: hello@venduremart.ph</div>
                  <div>Tel: (049) 123-4567</div>
                  <div className="mt-1">Cashier: Jho | Manager: Mav</div>
                </div>
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="bg-red-500 text-black px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>

              <hr className="my-2" />
              <div>
                Receipt #: {sale.id}
                <br />
                {new Date(sale.date).toLocaleString()}
              </div>
              <hr className="my-2" />

              <div>
                {sale.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-dotted py-1"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-right space-y-1">
                <div>Subtotal: ₱{(sale.total ?? 0).toFixed(2)}</div>
                <div>Tax (12%): ₱{(sale.tax ?? 0).toFixed(2)}</div>
                <div className="font-bold">
                  Total: ₱{((sale.total ?? 0) + (sale.tax ?? 0)).toFixed(2)}
                </div>
                <div>Cash: ₱{(sale.cash ?? 0).toFixed(2)}</div>
                <div>Change: ₱{(sale.change ?? 0).toFixed(2)}</div>
              </div>

              <hr className="my-2" />
              <div className="text-center text-xs mt-2 text-gray-500">
                ─────── THANK YOU FOR YOUR PURCHASE! ───────
                <br />
                This serves as your official receipt.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
