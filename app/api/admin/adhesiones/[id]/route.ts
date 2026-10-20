
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Contexto = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Contexto
) {
  // Todavía estamos trabajando en desarrollo.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Actualizaciones no habilitadas.",
      },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();

    // 1. Verificar la sesión.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Debés iniciar sesión.",
        },
        { status: 401 }
      );
    }

    // 2. Comprobar el permiso de administrador.
    const { data: admin, error: adminError } =
      await supabase
        .from("administradores")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No tenés autorización.",
        },
        { status: 403 }
      );
    }

    // 3. Validar el identificador.
    const { id } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Identificador inválido.",
        },
        { status: 400 }
      );
    }

    // 4. Validar el estado solicitado.
    const datos: unknown = await request.json();

    if (
      !datos ||
      typeof datos !== "object" ||
      Array.isArray(datos) ||
      !("estado" in datos)
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Solicitud inválida.",
        },
        { status: 400 }
      );
    }

    const estado = datos.estado;

    if (estado !== "aprobada" && estado !== "rechazada") {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Estado no permitido.",
        },
        { status: 400 }
      );
    }

    // 5. Actualizar exclusivamente una adhesión pendiente.
    // Se utiliza la sesión autenticada y las políticas RLS.
    const { data, error } = await supabase
      .from("adhesiones")
      .update({ estado })
      .eq("id", id)
      .eq("estado", "pendiente")
      .neq("version_proyecto", "prueba-tecnica")
      .select("id, estado")
      .maybeSingle();

    if (error) {
      console.error(
        "Error al actualizar estado de adhesión."
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se pudo actualizar la adhesión.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La adhesión no existe, ya fue revisada o es de prueba.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Estado actualizado correctamente.",
      estado: data.estado,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "No se pudo procesar la solicitud.",
      },
      { status: 400 }
    );
  }
}
