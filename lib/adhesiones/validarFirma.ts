
import "server-only";

const MAX_BYTES = 500_000;

export function validarFirma(
  firma: unknown
): Buffer | null {
  if (typeof firma !== "string") {
    return null;
  }

  const prefijo = "data:image/png;base64,";

  if (!firma.startsWith(prefijo)) {
    return null;
  }

  const base64 = firma.slice(prefijo.length);

  // Validar caracteres y tamaño aproximado.
  if (
    !base64 ||
    base64.length > Math.ceil(MAX_BYTES / 3) * 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)
  ) {
    return null;
  }

  const imagen = Buffer.from(base64, "base64");

  if (imagen.length === 0 || imagen.length > MAX_BYTES) {
    return null;
  }

  // Comprobar la firma característica de un archivo PNG.
  const cabeceraPNG = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);

  if (
    imagen.length < 33 ||
    !imagen.subarray(0, 8).equals(cabeceraPNG)
  ) {
    return null;
  }

  // Comprobar que el primer bloque sea IHDR y
  // que las dimensiones sean razonables.
  if (
    imagen.readUInt32BE(8) !== 13 ||
    imagen.toString("ascii", 12, 16) !== "IHDR"
  ) {
    return null;
  }

  const ancho = imagen.readUInt32BE(16);
  const alto = imagen.readUInt32BE(20);

  if (
    ancho < 1 ||
    alto < 1 ||
    ancho > 2000 ||
    alto > 1000
  ) {
    return null;
  }

  return imagen;
}

import sharp from "sharp";

export async function verificarImagenFirma(
  imagen: Buffer
): Promise<boolean> {
  try {
    const metadata = await sharp(imagen, {
      limitInputPixels: 2_000_000,
    }).metadata();

    if (
      metadata.format !== "png" ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > 2000 ||
      metadata.height > 1000
    ) {
      return false;
    }

    // Decodificar toda la imagen para detectar
    // archivos dañados o malformados.
    await sharp(imagen).png().toBuffer();

    return true;
  } catch {
    return false;
  }
}
