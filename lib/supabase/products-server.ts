import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

/**
 * Trae solo los productos activos para el catálogo público.
 * Esta función se ejecuta exclusivamente en el servidor.
 */
export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al traer productos activos:", error.message);
    return [];
  }

  return data ?? [];
}