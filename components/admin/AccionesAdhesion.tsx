
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  estado: string;
};

export default function AccionesAdhesion({
  id,
  estado,
}: Props) {
  const router = useRouter();

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function cambiarEstado(
    nuevoEstado: "aprobada" | "rechazada"
  ) {
    const confirmar = window.confirm(
      nuevoEstado === "aprobada"
        ? "¿Confirmás que querés aprobar esta adhesión?"
        : "¿Confirmás que querés rechazar esta adhesión?"
    );

    if (!confirmar) return;

    setCargando(true);
    setMensaje("");

    try {
      const respuesta = await fetch(
        `/api/admin/adhesiones/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          resultado.mensaje ||
            "No se pudo actualizar la adhesión."
        );
        return;
      }

      router.refresh();
    } catch {
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  if (estado !== "pendiente") {
    return (
      <span className="text-xs text-gray-500">
        Ya revisada
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={cargando}
        onClick={() => cambiarEstado("aprobada")}
        className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        Aprobar
      </button>

      <button
        type="button"
        disabled={cargando}
        onClick={() => cambiarEstado("rechazada")}
        className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-50"
      >
        Rechazar
      </button>

      {mensaje && (
        <p className="max-w-40 text-xs text-red-600">
          {mensaje}
        </p>
      )}
    </div>
  );
}
