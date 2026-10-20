
import "server-only";

import { crearClienteAdmin } from "@/lib/supabase/admin";
import type { DatosAdhesion } from "./validar";

type TipoRegistro = "prueba" | "real";

export async function guardarAdhesion(
  datos: DatosAdhesion,
  rutaFirma: string,
  tipo: TipoRegistro = "prueba"
): Promise<string> {
  const supabase = crearClienteAdmin();

  const versionProyecto =
    tipo === "prueba"
      ? "prueba-tecnica"
      : "jigote-belicho-v1";

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
      version_proyecto: versionProyecto,
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      "No se pudo registrar la adhesión."
    );
  }

  return data.id;
}
