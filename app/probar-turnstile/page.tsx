
"use client";

import { useState } from "react";
import VerificacionTurnstile from "@/components/adhesiones/VerificacionTurnstile";

export default function ProbarTurnstile() {
  const [token, setToken] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [verificando, setVerificando] = useState(false);
  const [intento, setIntento] = useState(0);

  async function verificar() {
    if (!token || verificando) return;

    setVerificando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/api/verificar-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const resultado = await respuesta.json();

      setMensaje(resultado.mensaje);
    } catch {
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setToken(null);
      setVerificando(false);
      setIntento((actual) => actual + 1);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-5 py-16">
      <div className="mx-auto max-w-lg rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-[#793b25]">
          Prueba de Cloudflare Turnstile
        </h1>

        <p className="mt-3 text-gray-600">
          Vamos a comprobar que el servidor puede verificar
          las solicitudes de nuestra aplicación.
        </p>

        <VerificacionTurnstile
          key={intento}
          onVerify={setToken}
        />

        <button
          type="button"
          onClick={verificar}
          disabled={!token || verificando}
          className="mt-5 w-full rounded-lg bg-[#91482d] p-3 font-bold text-white disabled:opacity-50"
        >
          {verificando ? "Verificando..." : "Probar verificación"}
        </button>

        {mensaje && (
          <p className="mt-5 text-sm font-semibold">
            {mensaje}
          </p>
        )}
      </div>
    </main>
  );
}
