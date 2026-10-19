
import { NextResponse } from "next/server";
import { validarAdhesion } from "@/lib/adhesiones/validar";

import {
  validarFirma,
  verificarImagenFirma,
} from "@/lib/adhesiones/validarFirma";



export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Evita procesar solicitudes excesivamente grandes.
    const longitud = Number(
      request.headers.get("content-length")
    );

    if (
      Number.isFinite(longitud) &&
      longitud > 1_500_000
    ) {
      return NextResponse.json(
        { ok: false, mensaje: "Solicitud demasiado grande." },
        { status: 413 }
      );
    }

    
    // Leer el cuerpo con un límite real de tamaño.
    const MAX_BODY_BYTES = 750_000;

    if (!request.body) {
      return NextResponse.json(
        { ok: false, mensaje: "Solicitud vacía." },
        { status: 400 }
      );
    }

    const lector = request.body.getReader();
    const fragmentos: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await lector.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_BODY_BYTES) {
        await lector.cancel();

        return NextResponse.json(
          {
            ok: false,
            mensaje: "La solicitud supera el tamaño permitido.",
          },
          { status: 413 }
        );
      }

      fragmentos.push(value);
    }

    const cuerpo = Buffer.concat(fragmentos);

    const datos: unknown = JSON.parse(
      cuerpo.toString("utf8")
    );


    if (!validarAdhesion(datos)) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Los datos del formulario no son válidos.",
        },
        { status: 400 }
      );
    }
    
    // Comprobar la estructura y el tamaño de la firma.
    const imagenFirma = validarFirma(datos.firma);

    if (!imagenFirma) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La firma no tiene un formato válido o supera el tamaño permitido.",
        },
        { status: 400 }
      );
    }
    
    const imagenValida = await verificarImagenFirma(
      imagenFirma
    );

    if (!imagenValida) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "La imagen de la firma está dañada o no es válida.",
        },
        { status: 400 }
      );
    }


    
    // Verificar Cloudflare Turnstile desde el servidor.
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La verificación de seguridad no está configurada.",
        },
        { status: 503 }
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
          secret,
          response: datos.turnstileToken,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!respuesta.ok) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se pudo comprobar la verificación de seguridad.",
        },
        { status: 503 }
      );
    }

    const resultado: {
      success?: boolean;
      hostname?: string;
    } = await respuesta.json();

    const hostnamePermitido =
      resultado.hostname === "localhost";

    if (!resultado.success || !hostnamePermitido) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La verificación de seguridad no es válida.",
        },
        { status: 403 }
      );
    }


    // El guardado sigue bloqueado hasta completar
    // la verificación de seguridad y privacidad.
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Formulario válido. El registro todavía no está habilitado.",
      },
      { status: 503 }
    );
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
