import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:ml-48 mb-16 md:mb-0">
        <Outlet />
      </main>
    </div>
  );
}
