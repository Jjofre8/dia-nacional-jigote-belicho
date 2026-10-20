
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  const autorizacion = request.headers.get("authorization");

  if (!secreto || !autorizacion) {
    return NextResponse.json(
      { ok: false, mensaje: "No autorizado." },
      { status: 401 }
    );
  }

  const recibido = Buffer.from(autorizacion);
  const esperado = Buffer.from(`Bearer ${secreto}`);

  if (
    recibido.length !== esperado.length ||
    !timingSafeEqual(recibido, esperado)
  ) {
    return NextResponse.json(
      { ok: false, mensaje: "No autorizado." },
      { status: 401 }
    );
  }

  // Seguridad: la limpieza todavía está desactivada.
  // La activaremos después de probar la eliminación
  // y el tratamiento de errores.
  return NextResponse.json(
    {
      ok: false,
      mensaje: "Limpieza automática pendiente de activación.",
    },
    { status: 503 }
  );
}
