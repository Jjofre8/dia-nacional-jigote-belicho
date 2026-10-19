
import "server-only";

import { crearClienteAdmin } from "@/lib/supabase/admin";
import type { DatosAdhesion } from "./validar";

export async function guardarAdhesion(
  datos: DatosAdhesion,
  rutaFirma: string
): Promise<string> {
  const supabase = crearClienteAdmin();

  const { data, error } = await supabase
    .from("adhesiones")
    .insert({
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      dni: datos.dni,
      domicilio: datos.domicilio.trim(),
      provincia: datos.provincia,
      firma_path: rutaFirma,
      consentimiento: true,
      fecha_consentimiento: new Date().toISOString(),
      version_proyecto: "jigote-belicho-v1",
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error || !data) {
    // No exponer errores internos de Supabase al visitante.
    throw new Error("No se pudo registrar la adhesión.");
  }

  return data.id;
}
