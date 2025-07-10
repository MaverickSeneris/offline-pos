import { products } from "../data/products";
import type { Product } from "../data/products";

type Props = {
  onAddToCart: (product: Product) => void;
};

export default function ProductList({ onAddToCart }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((item: Product) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg shadow hover:bg-blue-100 cursor-pointer"
          onClick={() => onAddToCart(item)}
        >
          <h2 className="font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-500">₱{item.price}</p>
        </div>
      ))}
    </div>
  );
}
