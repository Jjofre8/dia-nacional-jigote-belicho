
import "server-only";

import { createHmac } from "node:crypto";
import { crearClienteAdmin } from "@/lib/supabase/admin";

export async function limitarIntentos(
  ip: string
): Promise<boolean> {
  const secreto = process.env.RATE_LIMIT_SECRET;

  if (!secreto || secreto.length < 32) {
    throw new Error("Falta configurar RATE_LIMIT_SECRET");
  }

  // No almacenar la dirección IP directamente.
  const identificador = createHmac("sha256", secreto)
    .update(ip)
    .digest("hex");

  const supabase = crearClienteAdmin();

  const { data, error } = await supabase.rpc(
    "controlar_intento_adhesion",
    {
      p_identificador: identificador,
      p_max_intentos: 5,
      p_ventana_minutos: 60,
    }
  );

  if (error || typeof data !== "boolean") {
    throw new Error("No se pudo verificar el límite de intentos");
  }

  return data;
}
