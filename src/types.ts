// src/types.ts
import type { Product } from "./data/products";

export type Sale = {
  id: number;
  date: string;
  items: (Product & { quantity: number })[];
  total: number;
  tax: number;
  cash: number;
  change: number;
  branch_id?: string | number;
};
