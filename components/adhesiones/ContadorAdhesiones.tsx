
"use client";

import { useEffect, useState } from "react";

const META = 1500;

export default function ContadorAdhesiones() {
  const [aprobadas, setAprobadas] = useState<number | null>(
    null
  );

  useEffect(() => {
    let activo = true;

    async function actualizar() {
      try {
        const respuesta = await fetch(
          "/api/adhesiones/contador",
          { cache: "no-store" }
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el contador");
        }

        const datos = await respuesta.json();

        if (
          activo &&
          typeof datos.aprobadas === "number"
        ) {
          setAprobadas(datos.aprobadas);
        }
      } catch {
        // Conservar el último valor válido.
      }
    }

    void actualizar();

    const intervalo = setInterval(() => {
      void actualizar();
    }, 60000);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, []);

  const porcentaje =
    aprobadas === null
      ? 0
      : Math.min((aprobadas / META) * 100, 100);

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#e8dccb] bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#91482d]">
        Nuestra primera meta
      </p>

      <p className="mt-4 text-5xl font-extrabold text-[#793b25] md:text-6xl">
        {META.toLocaleString("es-AR")}
      </p>

      <p className="mt-3 text-lg">
        Adhesiones ciudadanas
      </p>

      <div
        className="mt-7 h-4 overflow-hidden rounded-full bg-[#e8dccb]"
        role="progressbar"
        aria-label="Progreso de adhesiones aprobadas"
        aria-valuemin={0}
        aria-valuemax={META}
        aria-valuenow={aprobadas ?? 0}
      >
        <div
          className="h-full rounded-full bg-[#91482d] transition-all duration-700"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <p className="mt-4 font-semibold text-[#793b25]">
        {aprobadas === null
          ? "Consultando adhesiones..."
          : `${aprobadas.toLocaleString("es-AR")} adhesiones aprobadas`}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {aprobadas === null
          ? "El contador se actualizará automáticamente."
          : `${porcentaje.toFixed(1)}% de la meta alcanzada`}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        Se contabilizan únicamente las adhesiones aprobadas.
      </p>
    </div>
  );
}
