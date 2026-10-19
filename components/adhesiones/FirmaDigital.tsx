
"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type FirmaDigitalProps = {
  onFirmar: (firma: string | null) => void;
};

export default function FirmaDigital({
  onFirmar,
}: FirmaDigitalProps) {
  const firmaRef = useRef<SignatureCanvas>(null);
  const [firmada, setFirmada] = useState(false);

  const limpiarFirma = () => {
    firmaRef.current?.clear();
    setFirmada(false);
    onFirmar(null);
  };

  const guardarFirma = () => {
    if (!firmaRef.current || firmaRef.current.isEmpty()) {
      alert("Primero tenés que dibujar tu firma.");
      return;
    }

    const imagenFirma = firmaRef.current.toDataURL("image/png");
    setFirmada(true);
    onFirmar(imagenFirma);
  };

  return (
    <div className="rounded-xl border border-[#e5d6c5] bg-white p-5">
      <h3 className="text-xl font-bold text-[#793b25]">
        Firma electrónica
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        Dibujá tu firma dentro del recuadro utilizando
        el dedo o el mouse.
      </p>

      <div className="mt-5 overflow-hidden rounded-lg border-2 border-dashed border-[#b88b72] bg-[#fffdf8]">
        <SignatureCanvas
          ref={firmaRef}
          penColor="#382b22"
          canvasProps={{
            width: 500,
            height: 180,
            className: "w-full touch-none",
            "aria-label": "Área para dibujar la firma",
          }}
          onBegin={() => {
            setFirmada(false);
            onFirmar(null);
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={limpiarFirma}
          className="rounded-lg border border-gray-300 px-5 py-3 font-semibold"
        >
          Borrar firma
        </button>

        <button
          type="button"
          onClick={guardarFirma}
          className="rounded-lg bg-[#91482d] px-5 py-3 font-bold text-white"
        >
          Confirmar firma
        </button>
      </div>

      {firmada && (
        <p className="mt-4 text-sm font-semibold text-green-700">
          ✓ Firma capturada correctamente.
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        La firma se captura en este dispositivo.
        Todavía no se envía ni se almacena en el servidor.
      </p>
    </div>
  );
}
