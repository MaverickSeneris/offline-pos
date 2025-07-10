import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import type { Product } from "../data/products";

const CART_KEY = "vendure_cart";

export default function POS() {
  // 🧠 Initialize cart from localStorage
  const [cart, setCart] = useState<Product[]>(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // 💾 Save cart to localStorage on every update
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleClearCart = () => {
    if (confirm("Clear cart?")) setCart([]);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">🛒 Products</h1>
        <ProductList onAddToCart={handleAddToCart} />
      </div>
      <div className="w-full md:w-1/3">
        <h1 className="text-2xl font-bold mb-4">🧾 Cart</h1>
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          {cart.length === 0 ? (
            <p>No items yet.</p>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>₱{item.price}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
              <button
                onClick={handleClearCart}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
