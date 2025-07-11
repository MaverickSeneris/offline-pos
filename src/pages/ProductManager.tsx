import { useState, useEffect } from "react";
import type { Product } from "../data/products";

const PRODUCTS_KEY = "vendure_products";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

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
    setProducts(products.filter((p) => p.id !== id));
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {product.name} - ₱{product.price}
            </span>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
