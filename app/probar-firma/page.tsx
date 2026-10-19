
"use client";

import { useState } from "react";
import FirmaDigital from "@/components/adhesiones/FirmaDigital";

export default function ProbarFirma() {
  const [firma, setFirma] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#faf7f0] px-5 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-[#793b25]">
          Prueba de firma electrónica
        </h1>

        <FirmaDigital onFirmar={setFirma} />

        <p className="mt-6 text-sm text-gray-600">
          Estado: {firma ? "Firma capturada" : "Sin confirmar"}
        </p>
      </div>
    </main>
  );
}
