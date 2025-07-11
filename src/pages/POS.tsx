import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import type { Product } from "../data/products";

const CART_KEY = "vendure_cart";
const SALES_KEY = "vendure_sales";
const TAX_RATE = 0.12;

type CartItem = Product & { quantity: number };

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cashPaid, setCashPaid] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      const parsed = JSON.parse(stored).map((item: any) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCart(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + tax;
  const change = parseFloat(cashPaid) - grandTotal;

  const handleAddToCart = (product: Product) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      updatedCart[index].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const handleClearCart = () => {
    if (confirm("Clear cart?")) setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!cashPaid) return alert("Enter cash paid.");
    if (change < 0) return alert("Insufficient cash.");

    const newSale = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
      tax,
      cash: parseFloat(cashPaid),
      change,
    };

    const existingSales = JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
    existingSales.push(newSale);

    localStorage.setItem(SALES_KEY, JSON.stringify(existingSales));
    setCart([]);
    setCashPaid("");

    alert("✅ Checkout successful!");
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <ProductList onAddToCart={handleAddToCart} />
      </div>

      <div className="w-full md:w-1/3">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
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
                      ₱{item.price} × {item.quantity}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 text-black bg-gray-600 rounded"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 text-black bg-gray-800 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12%):</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₱{grandTotal.toFixed(2)}</span>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Cash paid"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    className="w-full border rounded p-2 mt-2"
                  />
                </div>
                {cashPaid && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Change:</span>
                    <span>₱{change >= 0 ? change.toFixed(2) : "—"}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-black py-2 px-4 rounded"
              >
                Checkout
              </button>

              <hr />
              <button
                onClick={handleClearCart}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-black py-2 px-4 rounded"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>

        <a href="/sales" className="text-blue-500 underline mt-4 inline-block">
          View Sales History
        </a>
        <a href="/products" className="text-blue-500 underline mt-2 block">
          Manage Products
        </a>
      </div>
    </div>
  );
}
