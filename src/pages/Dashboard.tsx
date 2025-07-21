// src/pages/Dashboard.tsx
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) return <div className="p-4">⏳ Loading...</div>;
  if (!["manager", "owner"].includes(user.role))
    return <div className="p-4 text-red-600">⛔ Access Denied</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-gray-700">
        Role: <strong>{user?.role}</strong>
      </p>
      <p className="text-gray-700">
        Branch ID: <strong>{user?.branch_id}</strong>
      </p>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="space-y-4">
        {user.role === "owner" && (
          <Link
            to="/admin-roles"
            className="block bg-white p-4 rounded shadow hover:bg-gray-100"
          >
            🛠 Manage User Roles
          </Link>
        )}

        <Link
          to="/products"
          className="block bg-white p-4 rounded shadow hover:bg-gray-100"
        >
          🛒 Manage Products
        </Link>

        <Link
          to="/sales"
          className="block bg-white p-4 rounded shadow hover:bg-gray-100"
        >
          📈 View Sales History
        </Link>
      </div>
    </div>
  );
}
