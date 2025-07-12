import { useEffect, useState } from "react";

// Sale type definition
// Each sale has an ID, date, item list, totals, and optional tax, cash, change fields

// 🔐 Key used to store and retrieve sales data from localStorage
const SALES_KEY = "vendure_sales";

export default function Sales() {
  // 🧠 State to hold all sales
  const [sales, setSales] = useState<Sale[]>([]);

  // 📅 States to manage date filters
  const [fromDate, setFromDate] = useState(""); // Filter start date
  const [toDate, setToDate] = useState(""); // Filter end date

  // 🧲 Load sales from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(SALES_KEY);
    if (stored) {
      setSales(JSON.parse(stored));
    }
  }, []);

  // ❌ Delete a sale from both UI and localStorage
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return;

    const updatedSales = sales.filter((sale) => sale.id !== id);
    setSales(updatedSales);
    localStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
  };

  // 🔍 Filter sales by selected date range (if any)
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date).toISOString().slice(0, 10);
    return (
      (!fromDate || saleDate >= fromDate) && (!toDate || saleDate <= toDate)
    );
  });

  // 🎯 Preset filter for today only
  const setToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFromDate(today);
    setToDate(today);
  };

  // 🎯 Preset filter for current week
  const setThisWeek = () => {
    const now = new Date();
    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay()); // Sunday
    const last = new Date(first);
    last.setDate(first.getDate() + 6); // Saturday

    setFromDate(first.toISOString().slice(0, 10));
    setToDate(last.toISOString().slice(0, 10));
  };

  // 🎯 Preset filter for current month
  const setThisMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(first.toISOString().slice(0, 10));
    setToDate(last.toISOString().slice(0, 10));
  };

  // 🔄 Clear all filters to show all sales
  const clearFilter = () => {
    setFromDate("");
    setToDate("");
  };

  // 📦 Export filtered sales to CSV
  function downloadCSV(sales: Sale[]) {
    const rows = [
      ["Receipt ID", "Date", "Item", "Qty", "Price", "Total", "Cash", "Change"],
    ];

    sales.forEach((sale) => {
      sale.items.forEach((item, idx) => {
        rows.push([
          idx === 0 ? sale.id.toString() : "",
          idx === 0 ? new Date(sale.date).toLocaleString() : "",
          item.name,
          item.quantity.toString(),
          `₱${item.price.toFixed(2)}`,
          idx === 0 ? `₱${(sale.total + (sale.tax ?? 0)).toFixed(2)}` : "",
          idx === 0 ? `₱${(sale.cash ?? 0).toFixed(2)}` : "",
          idx === 0 ? `₱${(sale.change ?? 0).toFixed(2)}` : "",
        ]);
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 🖨️ Print a single receipt by injecting it into a hidden iframe
  const printReceipt = (sale: Sale) => {
    const printWindow = window.open("", "_blank", "width=350,height=600");

    if (!printWindow) return;

    const receiptHTML = `
      <html>
        <head>
          <title>Receipt #${sale.id}</title>
          <style>
            body {
              font-family: monospace;
              width: 300px;
              margin: 0 auto;
              padding: 10px;
            }
            hr {
              margin: 10px 0;
              border: none;
              border-top: 1px dotted #ccc;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .item {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px dotted #ccc;
              padding: 4px 0;
            }
            strong {
              font-weight: bold;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
                width: 300px;
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="text-center">
            <div><strong>Vendure Mart</strong></div>
            <div>123 National Rd, Rizal, Laguna</div>
            <div>Email: hello@venduremart.ph</div>
            <div>Tel: (049) 123-4567</div>
            <div>Cashier: Jho | Manager: Mav</div>
          </div>
          <hr />
          <div>Receipt #: ${sale.id}</div>
          <div>${new Date(sale.date).toLocaleString()}</div>
          <hr />
          ${sale.items
            .map(
              (item) => `
              <div class="item">
                <span>${item.name} � ${item.quantity}</span>
                <span>\u20b1${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `
            )
            .join("")}
          <hr />
          <div class="text-right">Subtotal: \u20b1${(sale.total ?? 0).toFixed(
            2
          )}</div>
          <div class="text-right">Tax (12%): \u20b1${(sale.tax ?? 0).toFixed(
            2
          )}</div>
          <div class="text-right"><strong>Total: \u20b1${(
            (sale.total ?? 0) + (sale.tax ?? 0)
          ).toFixed(2)}</strong></div>
          <div class="text-right">Cash: \u20b1${(sale.cash ?? 0).toFixed(
            2
          )}</div>
          <div class="text-right">Change: \u20b1${(sale.change ?? 0).toFixed(
            2
          )}</div>
          <hr />
          <div class="text-center">\u2500\u2500\u2500 THANK YOU FOR YOUR PURCHASE! \u2500\u2500\u2500
            <br />
                This serves as your official receipt.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
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
        <button
          onClick={() => downloadCSV(filteredSales)}
          className="bg-green-500 text-black px-3 py-1 rounded text-sm"
        >
          ⬇️ Download CSV
        </button>
      </div>

      {/* 🧾 Render filtered receipts */}
      {filteredSales.length === 0 ? (
        <p className="text-gray-500">No sales in this range.</p>
      ) : (
        <div className="space-y-6">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white p-4 rounded shadow font-mono text-sm mx-auto w-[300px] print:w-[300px]"
            >
              <div className="flex justify-between items-center mb-2">
                {/* Print and Delete buttons */}
                {/* Hide on print */}
                <div className="flex gap-[1px] print:hidden ml-auto">
                  <button
                    onClick={() => printReceipt(sale)}
                    className="bg-blue-500 text-black px-2 py-1 rounded"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="bg-red-500 text-black px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col justify-center items-center">
                  <div className="font-bold text-lg">
                    Vendure Mart
                  </div>
                  <div>123 National Rd, Rizal, Laguna</div>
                  <div>Email: hello@venduremart.ph</div>
                  <div>Tel: (049) 123-4567</div>
                  <div className="mt-1">Cashier: Jho | Manager: Mav</div>
                </div>
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

              <div className="mt-2 text-right space-y-1 mb-6">
                <div>Subtotal: ₱{(sale.total ?? 0).toFixed(2)}</div>
                <div>Tax (12%): ₱{(sale.tax ?? 0).toFixed(2)}</div>
                <div className="font-bold">
                  Total: ₱{((sale.total ?? 0) + (sale.tax ?? 0)).toFixed(2)}
                </div>
                <div>Cash: ₱{(sale.cash ?? 0).toFixed(2)}</div>
                <div>Change: ₱{(sale.change ?? 0).toFixed(2)}</div>
              </div>

              <hr className="my-2" />
              <div className="text-center text-xs my-4 text-gray-500">
                ─── THANK YOU FOR YOUR PURCHASE! ───
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

// 🧾 Type definition for a single sale transaction
type Sale = {
  id: number;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  tax?: number;
  cash?: number;
  change?: number;
};
