
import "server-only";

import { randomUUID } from "node:crypto";
import { crearClienteAdmin } from "@/lib/supabase/admin";

const BUCKET = "firmas-adhesiones";

export async function guardarFirma(
  imagen: Buffer
): Promise<string> {
  const supabase = crearClienteAdmin();

  // Usamos un nombre aleatorio para no exponer
  // el nombre ni el DNI del ciudadano.
  const ruta = `${randomUUID()}.png`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, imagen, {
      contentType: "image/png",
      upsert: false,
      cacheControl: "0",
    });

  if (error) {
    throw new Error("No se pudo almacenar la firma.");
  }

  // Devolvemos la ruta privada, no una URL pública.
  return ruta;
}

export async function eliminarFirma(
  ruta: string
): Promise<void> {
  const supabase = crearClienteAdmin();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([ruta]);

  if (error) {
    throw new Error("No se pudo eliminar la firma.");
  }
}
