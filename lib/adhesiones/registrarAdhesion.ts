
import "server-only";

import type { DatosAdhesion } from "./validar";
import { guardarFirma, eliminarFirma } from "./guardarFirma";
import { guardarAdhesion } from "./guardarAdhesion";


export async function registrarAdhesion(
  datos: DatosAdhesion,
  imagenFirma: Buffer,
  tipo: "prueba" | "real" = "prueba"
): Promise<string> {

  // Primero se guarda la firma en Storage.
  const rutaFirma = await guardarFirma(imagenFirma);

  try {
    // Después se guarda la adhesión en PostgreSQL.
    const id = await guardarAdhesion(datos, rutaFirma, tipo);

    return id;
  } catch (error) {
    // Si falla la base de datos, intentamos
    // eliminar la firma que acabamos de subir.
    try {
      await eliminarFirma(rutaFirma);
    } catch {
      // Registrar sin revelar datos personales.
      console.error(
        "No se pudo limpiar una firma tras fallar el registro."
      );
    }

    throw error;
  }
}
