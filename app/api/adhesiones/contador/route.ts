
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const clave = process.env.SUPABASE_SECRET_KEY;

    if (!url || !clave) {
      return NextResponse.json(
        { mensaje: "Contador no disponible" },
        { status: 503 }
      );
    }

    const supabase = createClient(url, clave, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { count, error } = await supabase
      .from("adhesiones")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("estado", "aprobada")
      .neq("version_proyecto", "prueba-tecnica");

    if (error) {
      throw new Error("No se pudo consultar el contador");
    }

    return NextResponse.json(
      { aprobadas: count ?? 0 },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { mensaje: "Contador temporalmente no disponible" },
      { status: 500 }
    );
  }
}
