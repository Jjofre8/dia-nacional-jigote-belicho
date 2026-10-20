
"use client";

import { useState } from "react";
import FirmaDigital from "./FirmaDigital";
import VerificacionTurnstile from "./VerificacionTurnstile";

export default function FormularioPrueba() {
  const [firma, setFirma] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function enviarPrueba() {
    if (!firma || !token || enviando) return;

    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/api/adhesiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: "PRUEBA",
          apellido: "TECNICA",
          dni: "99999999",
          domicilio: "DOMICILIO FICTICIO 123",
          provincia: "Catamarca",
          firma,
          aceptaProyecto: true,
          aceptaPrivacidad: true,
          turnstileToken: token,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          resultado.mensaje || "No se pudo registrar la prueba."
        );
        return;
      }

      setMensaje(
        `Prueba registrada correctamente. ID: ${resultado.id}`
      );

      setFirma(null);
    } catch {
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
      setToken(null);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-lg bg-gray-100 p-4 text-sm">
        <p><strong>Nombre:</strong> PRUEBA</p>
        <p><strong>Apellido:</strong> TECNICA</p>
        <p><strong>DNI:</strong> 99999999 (ficticio)</p>
        <p><strong>Provincia:</strong> Catamarca</p>
      </div>

      <FirmaDigital onFirmar={setFirma} />

      <VerificacionTurnstile onVerify={setToken} />

      <button
        type="button"
        onClick={enviarPrueba}
        disabled={!firma || !token || enviando}
        className="w-full rounded-xl bg-[#793b25] px-6 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Enviando prueba..." : "Registrar adhesión ficticia"}
      </button>

      {mensaje && (
        <p className="rounded-lg bg-[#faf7f0] p-4 text-sm">
          {mensaje}
        </p>
      )}
    </div>
  );
}
