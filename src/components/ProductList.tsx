import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import Numpad from "../components/NumPad";

type Props = {
  onAddToCart: (product: Product) => void;
  setCashPaid: React.Dispatch<React.SetStateAction<string>>;
};

export default function ProductList({ onAddToCart, setCashPaid }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  // const [price, setPrice] = useState("");

  const handleNumpadInput = (value: string) => {
    setCashPaid((prev) => {
      if (value === "\u2190") return prev.slice(0, -1);
      if (value === "C") return "";
      return prev + value;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("vendure_products");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="bg-white rounded shadow p-4 hover:bg-gray-100 text-left"
          >
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-gray-600">₱{product.price}</p>
          </button>
        ))}
      </div>
      <div className="hidden md:block">
        <Numpad onInput={handleNumpadInput} />
      </div>
    </div>
  );
}
