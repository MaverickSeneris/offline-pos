import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import AuthPage from "./pages/AuthPage";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import ProductManager from "./pages/ProductManager";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AdminRoles from "./pages/AdminRoles";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <Routes>
      {!session ? (
        <Route path="*" element={<AuthPage />} />
      ) : (
        <>
          {/* Public home with POS for cashier */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["cashier", "manager", "owner"]}>
                <POS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-roles"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AdminRoles />
              </ProtectedRoute>
            }
          />

          {/* Logout is accessible by all roles */}
          <Route path="/logout" element={<Logout />} />

          {/* Protected layout routes for managers/owners only */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["cashier", "manager", "owner"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<ProductManager />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

function Logout() {
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      window.location.href = "/";
    });
  }, []);
  return null;
}
