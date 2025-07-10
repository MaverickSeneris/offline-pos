import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import type { Product } from "../data/products";

// ✅ Good practice: centralized storage keys
const CART_KEY = "vendure_cart";
const SALES_KEY = "vendure_sales";

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

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const newSale = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    const existingSales = JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
    existingSales.push(newSale);

    localStorage.setItem(SALES_KEY, JSON.stringify(existingSales));
    setCart([]);

    alert("✅ Checkout successful!");
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
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-gray-500 text-sm">
                      ₱{item.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={handleCheckout}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-black py-2 px-4 rounded"
              >
                Checkout
              </button>

              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
              <button
                onClick={handleClearCart}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-black py-2 px-4 rounded"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>
        <a href="/sales" className="text-blue-500 underline">
          → View Sales History
        </a>
      </div>
    </div>
  );
}
