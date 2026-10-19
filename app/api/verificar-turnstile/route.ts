
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        { ok: false, mensaje: "Turnstile no configurado." },
        { status: 500 }
      );
    }

    const { token } = await request.json();

    if (typeof token !== "string" || !token || token.length > 2048) {
      return NextResponse.json(
        { ok: false, mensaje: "Token inválido." },
        { status: 400 }
      );
    }

    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const respuesta = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        cache: "no-store",
      }
    );

    if (!respuesta.ok) {
      throw new Error("Error de comunicación con Cloudflare");
    }

    const resultado = await respuesta.json();

    const correcto =
      resultado.success === true &&
      resultado.hostname === "localhost";

    return NextResponse.json({
      ok: correcto,
      mensaje: correcto
        ? "Verificación correcta."
        : "La verificación no fue válida.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "Error al verificar." },
      { status: 500 }
    );
  }
}
