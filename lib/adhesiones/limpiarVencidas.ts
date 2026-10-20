
import "server-only";

import { crearClienteAdmin } from "@/lib/supabase/admin";

type AdhesionVencida = {
  id: string;
  firma_path: string | null;
};

export async function limpiarAdhesionesVencidas() {
  const supabase = crearClienteAdmin();

  // Buscar adhesiones que superaron los 12 meses.
  const { data, error } = await supabase.rpc(
    "obtener_adhesiones_vencidas"
  );

  if (error) {
    throw new Error(
      "No se pudieron consultar las adhesiones vencidas."
    );
  }

  const vencidas = (data ?? []) as AdhesionVencida[];

  let eliminadas = 0;
  let errores = 0;

  for (const adhesion of vencidas) {
    try {
      // Eliminar primero la firma del almacenamiento privado.
      if (adhesion.firma_path) {
        const { error: errorFirma } = await supabase.storage
          .from("firmas-adhesiones")
          .remove([adhesion.firma_path]);

        if (errorFirma) {
          throw new Error("Error al eliminar firma");
        }
      }

      // Eliminar después el registro de PostgreSQL.
      
    const fechaLimite = new Date();
    fechaLimite.setUTCMonth(fechaLimite.getUTCMonth() - 12);

    const { data: registrosEliminados, error: errorRegistro } =
    await supabase
        .from("adhesiones")
        .delete()
        .eq("id", adhesion.id)
        .lt("fecha_adhesion", fechaLimite.toISOString())
        .select("id");

    if (errorRegistro || !registrosEliminados?.length) {
    throw new Error("No se pudo confirmar la eliminación.");
    }


      if (errorRegistro) {
        throw new Error("Error al eliminar registro");
      }

      eliminadas++;
    } catch {
      errores++;
      console.error(
        "No se pudo completar la limpieza de una adhesión vencida."
      );
    }
  }

  return {
    revisadas: vencidas.length,
    eliminadas,
    errores,
  };
}
