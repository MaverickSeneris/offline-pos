// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const { pathname } = useLocation();

  if (!user) return null;

  const links = [
    { to: "/sales", label: "Sales", roles: ["manager", "owner"] },
    { to: "/products", label: "Products", roles: ["manager", "owner"] },
    { to: "/logout", label: "Logout", roles: ["cashier", "manager", "owner"] },
  ];

  return (
    <nav className="bg-white shadow md:min-h-screen md:w-48 w-full fixed bottom-0 md:static flex md:flex-col justify-around md:justify-start md:gap-4 p-2 md:p-4 text-sm z-50">
      {links.map(({ to, label, roles }) =>
        roles.includes(user.role) ? (
          <Link
            key={to}
            to={to}
            className={`block text-center md:text-left px-3 py-2 rounded hover:bg-gray-200 ${
              pathname === to ? "bg-gray-200 font-bold" : ""
            }`}
          >
            {label}
          </Link>
        ) : null
      )}
    </nav>
  );
}
