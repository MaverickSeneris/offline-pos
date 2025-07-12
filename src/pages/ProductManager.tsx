import { useState, useEffect } from "react";
import type { Product } from "../data/products";

const PRODUCTS_KEY = "vendure_products";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false); // ✅ to avoid early overwrite

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // ✅ Load products from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProducts(parsed);
      } catch (err) {
        console.error("Error parsing products:", err);
      }
    }
    setLoaded(true); // 🧠 only after loading, set this true
  }, []);

  // ✅ Save products *only after* initial load
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, loaded]);

  const handleAdd = () => {
    if (!name || !price) return;

    const newProduct: Product = {
      id: Date.now(),
      name,
      price: parseFloat(price),
    };

    setProducts([...products, newProduct]);
    setName("");
    setPrice("");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const startEdit = (product: Product) => {
    setEditId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditPrice("");
  };

  const saveEdit = () => {
    if (!editName || !editPrice) return;
    const updated = products.map((p) =>
      p.id === editId
        ? { ...p, name: editName, price: parseFloat(editPrice) }
        : p
    );
    setProducts(updated);
    cancelEdit();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row justify-between gap-2">
        <a href="/" className="text-blue-600 underline">
          ← Back to POS
        </a>
        <a href="/sales" className="text-blue-600 underline">
          → View Sales History
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-4">Product Manager</h1>

      {/* Add product form */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Product name"
          className="border p-2 rounded w-full md:w-1/2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded w-full md:w-1/4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-black px-4 py-2 rounded w-full md:w-auto"
        >
          Add
        </button>
      </div>

      {/* Product list */}
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded bg-white shadow-sm space-y-2"
          >
            {editId === product.id ? (
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <input
                  type="text"
                  className="border p-2 rounded w-full md:w-1/2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded w-full md:w-1/4"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-black px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <span className="text-lg">
                  {product.name} - ₱{product.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="bg-yellow-500 text-black px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-black px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
