import { useState, useEffect } from "react";
import type { Product } from "../data/products";

const PRODUCTS_KEY = "vendure_products";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Manager</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Product name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-black px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border p-2 rounded"
          >
            {editId === product.id ? (
              <div className="flex flex-col md:flex-row gap-2 w-full md:items-center">
                <input
                  type="text"
                  className="border p-1 rounded w-full md:w-40"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  className="border p-1 rounded w-full md:w-28"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-black px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-black px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <span>
                  {product.name} - ₱{product.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="bg-yellow-500 text-black px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-black px-2 py-1 rounded"
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
