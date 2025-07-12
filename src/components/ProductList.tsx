import { useEffect, useState } from "react";
import { products as seedProducts, type Product } from "../data/products";
import Numpad from "../components/NumPad";

const PRODUCTS_KEY = "vendure_products";

type Props = {
  onAddToCart: (product: Product) => void;
  setCashPaid: React.Dispatch<React.SetStateAction<string>>;
};

export default function ProductList({ onAddToCart, setCashPaid }: Props) {
  const [productList, setProductList] = useState<Product[]>([]); // ✅ renamed to avoid conflict

  const handleNumpadInput = (value: string) => {
    setCashPaid((prev) => {
      if (value === "\u2190") return prev.slice(0, -1);
      if (value === "C") return "";
      return prev + value;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      setProductList(JSON.parse(stored));
    } else {
      // First-time visit: use seed and persist it
      setProductList(seedProducts);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
    }
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {productList.map((product) => (
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
