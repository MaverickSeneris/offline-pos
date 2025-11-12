// src/contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Profile = {
  id: string;
  name: string;
  role: "cashier" | "manager" | "owner";
  branch_id: number;
};

type UserContextType = {
  user: Profile | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, role, branch_id")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("\u274c Failed to fetch profile:", error);
        setUser(null);
      } else {
        setUser(profile);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
