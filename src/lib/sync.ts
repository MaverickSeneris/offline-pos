// src/lib/sync.ts
import { supabase } from "./supabaseClient"; // ✅ "./" since it's in the same folder
import type { Sale } from "../types";         // ✅ Create this if not yet existing


// Where we temporarily store sales while offline
const UNSYNCED_KEY = "unsynced_sales";

export function saveSaleLocally(sale: Sale) {
  const current = JSON.parse(localStorage.getItem(UNSYNCED_KEY) || "[]");
  current.push(sale);
  localStorage.setItem(UNSYNCED_KEY, JSON.stringify(current));
}

export async function syncSalesToSupabase() {
  const stored = localStorage.getItem(UNSYNCED_KEY);
  if (!stored) return;

  const sales: Sale[] = JSON.parse(stored);

  for (const sale of sales) {
    const { error } = await supabase.from("sales").insert(sale);
    if (error) {
      console.error("\u274c Failed to sync sale:", error);
      return; // stop on first failure to retry later
    }
  }

  console.log("\u2705 Sales synced to Supabase.");
  localStorage.removeItem(UNSYNCED_KEY); // Clear after success
}
