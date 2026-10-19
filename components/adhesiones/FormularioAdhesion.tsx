
"use client";

import { useState } from "react";
import FirmaDigital from "./FirmaDigital";
import VerificacionTurnstile from "./VerificacionTurnstile";

const provincias = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export default function FormularioAdhesion() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [provincia, setProvincia] = useState("");
  const [firma, setFirma] = useState<string | null>(null);
  const [aceptaProyecto, setAceptaProyecto] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [turnstileToken, setTurnstileToken] =
  useState<string | null>(null);

  const formularioCompleto =
    nombre.trim().length >= 2 &&
    apellido.trim().length >= 2 &&
    /^\d{7,8}$/.test(dni) &&
    domicilio.trim().length >= 5 &&
    provincia !== "" &&
    firma !== null &&
    aceptaProyecto &&
    aceptaPrivacidad;
    turnstileToken !== null;
    

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
      <h2 className="text-3xl font-bold text-[#793b25]">
        Sumá tu adhesión
      </h2>

      <p className="mt-4 text-gray-600">
        Acompañá la propuesta de declarar el 3 de enero
        como Día Nacional del Jigote Belicho.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          // El envío se implementará en una etapa posterior.
        }}
      >
        <div>
          <label htmlFor="nombre" className="font-semibold">
            Nombre
          </label>
          <input
            id="nombre"
            required
            maxLength={80}
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="apellido" className="font-semibold">
            Apellido
          </label>
          <input
            id="apellido"
            required
            maxLength={80}
            autoComplete="family-name"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="dni" className="font-semibold">
            DNI
          </label>
          <input
            id="dni"
            required
            inputMode="numeric"
            maxLength={8}
            value={dni}
            onChange={(e) =>
              setDni(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Sin puntos"
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="domicilio" className="font-semibold">
            Domicilio declarado
          </label>
          <input
            id="domicilio"
            required
            maxLength={180}
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            placeholder="Calle, número y localidad"
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="provincia" className="font-semibold">
            Provincia
          </label>
          <select
            id="provincia"
            required
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          >
            <option value="">Seleccionar provincia</option>
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-[#faf7f0] p-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={aceptaProyecto}
              onChange={(e) =>
                setAceptaProyecto(e.target.checked)
              }
              className="mt-1"
            />
            <span className="text-sm">
              Declaro que he leído la propuesta para
              instituir el 3 de enero como Día Nacional
              del Jigote Belicho y manifiesto mi voluntad
              de adherir a ella.
            </span>
          </label>
        </div>

        <FirmaDigital onFirmar={setFirma} />

        <div className="rounded-lg bg-[#faf7f0] p-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={aceptaPrivacidad}
              onChange={(e) =>
                setAceptaPrivacidad(e.target.checked)
              }
              className="mt-1"
            />
            <span className="text-sm">
              Acepto el tratamiento de mis datos
              personales exclusivamente para registrar
              esta adhesión y gestionar su eventual
              presentación ante las autoridades,
              conforme a la política de privacidad
              que deberá publicarse antes de habilitar
              el formulario.
            </span>
          </label>
        </div>
        
        <VerificacionTurnstile
          onVerify={setTurnstileToken}
        />


        <button
          type="submit"
          disabled
          className="w-full rounded-xl bg-[#91482d] px-6 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Registro próximamente disponible
        </button>

        <p className="text-center text-xs text-gray-500">
          Formulario en desarrollo. No se almacenan
          ni se envían datos personales.
        </p>
      </form>
    </div>
  );
}
