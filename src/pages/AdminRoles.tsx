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
  const [search, setSearch] = useState("");

  // 🔄 Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, role, branch_id")
        .neq("id", user?.id);

      if (error) {
        console.error("❌ Failed to fetch profiles:", error.message);
      } else {
        setProfiles(data || []);
      }

      setLoading(false);
    };

    if (user) fetchProfiles();
  }, [user]);

  const handleRoleChange = async (id: string, newRole: Profile["role"]) => {
    if (id === user?.id) {
      alert("⚠️ You cannot change your own role.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      alert("❌ Failed to update role.");
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, role: newRole } : p))
      );
    }
  };

  const handleResetPassword = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("❌ Cannot find user email.");
      return;
    }

    const { error: resetError } =
      await supabase.auth.admin.resetPasswordForEmail(id);

    if (resetError) {
      alert("❌ Failed to send reset email.");
    } else {
      alert("📧 Password reset email sent.");
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    `${p.name} ${p.id}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || user.role !== "owner") {
    return <div className="p-4 text-red-600">⛔ Access Denied</div>;
  }

  if (loading) return <div className="p-4">⏳ Loading users...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🛠 Manage User Roles</h1>

      <input
        type="text"
        placeholder="🔍 Search by name or ID"
        className="border px-3 py-1 rounded mb-4 w-full max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full text-sm border border-gray-300 rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Change Role</th>
            <th className="p-2 border">Reset Password</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            filteredProfiles.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{p.name || "—"}</td>
                <td className="p-2 border">{p.id}</td>
                <td className="p-2 border capitalize">{p.role}</td>
                <td className="p-2 border">
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
                <td className="p-2 border">
                  <button
                    onClick={() => handleResetPassword(p.id)}
                    className="text-blue-600 underline text-xs"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
