
import "server-only";

import { crearClienteAdmin } from "@/lib/supabase/admin";

export async function esDniDuplicado(
  dni: string
): Promise<boolean> {
  const supabase = crearClienteAdmin();

  const { count, error } = await supabase
    .from("adhesiones")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("dni", dni);

  if (error) {
    throw new Error(
      "No se pudo comprobar la existencia de adhesiones."
    );
  }

  return (count ?? 0) > 0;
}
