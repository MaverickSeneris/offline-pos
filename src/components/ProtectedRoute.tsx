// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

type Props = {
  children: React.ReactNode;
  allowedRoles: Array<"cashier" | "manager" | "owner">;
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useUser();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role)) {
    return <div className="p-4 text-red-600">⛔ Access Denied</div>;
  }

  return <>{children}</>;
}
