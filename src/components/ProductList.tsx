import { useEffect, useState } from "react";
import type { Product } from "../data/products";

type Props = {
  onAddToCart: (product: Product) => void;
};

export default function ProductList({ onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("vendure_products");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  return (
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
  );
}
