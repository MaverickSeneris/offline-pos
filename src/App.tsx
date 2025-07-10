import { Routes, Route, Navigate } from "react-router-dom";
import POS from "./pages/POS";
import Sales from "./pages/Sales";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<POS />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
