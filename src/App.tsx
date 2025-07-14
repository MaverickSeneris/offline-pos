import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import ProductManager from "./pages/ProductManager";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./lib/supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

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
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["cashier", "manager"]}>
                <POS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ProductManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
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
