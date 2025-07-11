import { Routes, Route, Navigate } from "react-router-dom";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import ProductManager from "./pages/ProductManager";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<POS />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/products" element={<ProductManager />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
