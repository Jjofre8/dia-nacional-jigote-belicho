
import "server-only";

import { isIP } from "node:net";

export function obtenerIp(request: Request): string | null {
  // Esta aplicación utilizará el proxy de Vercel.
  // No se acepta cualquier encabezado arbitrario.
  if (
    process.env.VERCEL !== "1" ||
    process.env.TRUST_VERCEL_IP !== "true"
  ) {
    return null;
  }

  const encabezado = request.headers.get(
    "x-forwarded-for"
  );

  if (!encabezado) {
    return null;
  }

  const ip = encabezado.split(",")[0]?.trim();

  if (!ip || isIP(ip) === 0) {
    return null;
  }

  return ip;
}
