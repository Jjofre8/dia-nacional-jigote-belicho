

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { validarAdhesion } from "@/lib/adhesiones/validar";
import {
  validarFirma,
  verificarImagenFirma,
} from "@/lib/adhesiones/validarFirma";

import { registrarAdhesion } from "@/lib/adhesiones/registrarAdhesion";
import { limitarIntentos } from "@/lib/adhesiones/limitarIntentos";
import { obtenerIp } from "@/lib/adhesiones/obtenerIp";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 750_000;

function errorJson(mensaje: string, status: number) {
  return NextResponse.json(
    { ok: false, mensaje },
    { status }
  );
}

async function esAdministrador(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return false;

  const { data: admin, error: adminError } =
    await supabase
      .from("administradores")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  return !adminError && !!admin;
}

export async function POST(request: Request) {
  const esDesarrollo = process.env.NODE_ENV === "development";
  const publicoHabilitado =
    process.env.ADHESIONES_HABILITADAS === "true";

  // En producción, mantener cerrado hasta activar
  // expresamente el registro.
  if (!esDesarrollo && !publicoHabilitado) {
    return errorJson(
      "El registro ciudadano todavía no está habilitado.",
      503
    );
  }

  try {
    const tipoContenido =
      request.headers.get("content-type") ?? "";

    if (
      !tipoContenido
        .toLowerCase()
        .startsWith("application/json")
    ) {
      return errorJson("Se requiere contenido JSON.", 415);
    }

    // Control previo del tamaño declarado.
    const longitud = request.headers.get("content-length");

    if (
      longitud !== null &&
      Number(longitud) > MAX_BODY_BYTES
    ) {
      return errorJson("Solicitud demasiado grande.", 413);
    }

    if (!request.body) {
      return errorJson("Solicitud vacía.", 400);
    }

    // Lectura del cuerpo con límite efectivo.
    const lector = request.body.getReader();
    const fragmentos: Uint8Array[] = [];
    let bytes = 0;

    while (true) {
      const { done, value } = await lector.read();

      if (done) break;

      bytes += value.byteLength;

      if (bytes > MAX_BODY_BYTES) {
        await lector.cancel();
        return errorJson("Solicitud demasiado grande.", 413);
      }

      fragmentos.push(value);
    }

    const datos: unknown = JSON.parse(
      Buffer.concat(fragmentos).toString("utf8")
    );

    if (!validarAdhesion(datos)) {
      return errorJson(
        "Los datos ingresados no son válidos.",
        400
      );
    }

    const imagenFirma = validarFirma(datos.firma);

    if (
      !imagenFirma ||
      !(await verificarImagenFirma(imagenFirma))
    ) {
      return errorJson(
        "La imagen de la firma no es válida.",
        400
      );
    }

    // Único flujo de pruebas autorizado.
    const datosFicticios =
      datos.nombre === "PRUEBA" &&
      datos.apellido === "TECNICA" &&
      datos.dni === "99999999" &&
      datos.domicilio === "DOMICILIO FICTICIO 123" &&
      datos.provincia === "Catamarca";

    let tipoRegistro: "prueba" | "real";

    if (esDesarrollo) {
      // En desarrollo solamente se aceptan pruebas
      // del administrador, nunca adhesiones reales.
      if (!datosFicticios || !(await esAdministrador())) {
        return errorJson(
          "Solo se permiten pruebas administrativas.",
          403
        );
      }

      tipoRegistro = "prueba";
    } else {
      if (!publicoHabilitado) {
        return errorJson(
          "El registro no está habilitado.",
          503
        );
      }

      // Prohibir los datos reservados para pruebas.
      if (datosFicticios) {
        return errorJson(
          "Los datos ingresados no son válidos.",
          400
        );
      }

      // No aceptar registros sin un control de IP
      // habilitado y comprobado.
      const ip = obtenerIp(request);

      if (!ip) {
        return errorJson(
          "El registro no está disponible temporalmente.",
          503
        );
      }

      const permitido = await limitarIntentos(ip);

      if (!permitido) {
        return errorJson(
          "Demasiados intentos. Volvé más tarde.",
          429
        );
      }

      tipoRegistro = "real";
    }

    // Cloudflare se verifica en la misma solicitud
    // que posteriormente registra la adhesión.
    const secreto = process.env.TURNSTILE_SECRET_KEY;

    if (!secreto) {
      return errorJson(
        "Verificación de seguridad no disponible.",
        503
      );
    }

    const respuesta = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secreto,
          response: datos.turnstileToken,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!respuesta.ok) {
      return errorJson(
        "No se pudo comprobar la verificación.",
        503
      );
    }

    const verificacion: {
      success?: boolean;
      hostname?: string;
    } = await respuesta.json();

    const hostnamePermitido =
      tipoRegistro === "prueba"
        ? verificacion.hostname === "localhost"
        : !!process.env.TURNSTILE_ALLOWED_HOSTNAME &&
          verificacion.hostname ===
            process.env.TURNSTILE_ALLOWED_HOSTNAME;

    if (!verificacion.success || !hostnamePermitido) {
      return errorJson(
        "La verificación de seguridad no es válida.",
        403
      );
    }

    // Guardar solamente después de superar
    // todas las comprobaciones anteriores.
    const id = await registrarAdhesion(
      datos,
      imagenFirma,
      tipoRegistro
    );

    return NextResponse.json(
      {
        ok: true,
        mensaje:
          tipoRegistro === "prueba"
            ? "Adhesión ficticia registrada."
            : "Adhesión recibida y pendiente de revisión.",
        id,
      },
      { status: 201 }
    );
  } catch {
    console.error(
      "No se pudo completar el registro de adhesión."
    );

    // No exponer errores internos de Supabase,
    // DNI existentes ni otros datos privados.
    return errorJson(
      "No se pudo completar el registro. Intentá más tarde.",
      503
    );
  }
}
