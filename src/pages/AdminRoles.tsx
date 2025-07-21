// src/pages/AdminRoles.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../contexts/UserContext";

type Profile = {
  id: string;
  name: string;
  role: "cashier" | "manager" | "owner";
  branch_id: number;
};

export default function AdminRoles() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id); // exclude self

      if (error) {
        console.error("❌ Failed to fetch users", error);
      } else {
        setProfiles(data);
      }

      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

 const handleRoleChange = async (id: string, newRole: Profile["role"]) => {
   if (id === user?.id) {
     alert("\u26a0\ufe0f You cannot change your own role.");
     return;
   }

   const { error } = await supabase
     .from("profiles")
     .update({ role: newRole })
     .eq("id", id);

   if (error) {
     alert("\u274c Failed to update role");
   } else {
     setProfiles((prev) =>
       prev.map((p) => (p.id === id ? { ...p, role: newRole } : p))
     );
   }
 };


  if (!user || user.role !== "owner") {
    return <div className="p-4 text-red-600">⛔ Access Denied</div>;
  }

  if (loading) return <div className="p-4">⏳ Loading users...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🛠 Manage User Roles</h1>

      <table className="w-full table-auto border border-gray-300 rounded overflow-hidden text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">User ID</th>
            <th className="p-2">Role</th>
            <th className="p-2">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{p.name || "—"}</td>
              <td className="p-2">{p.id}</td>
              <td className="p-2 capitalize">{p.role}</td>
              <td className="p-2">
                <select
                  value={p.role}
                  onChange={(e) =>
                    handleRoleChange(p.id, e.target.value as Profile["role"])
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
