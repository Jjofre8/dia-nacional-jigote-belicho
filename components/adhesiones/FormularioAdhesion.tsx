
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

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [claveTurnstile, setClaveTurnstile] = useState(0);
  const [claveFirma, setClaveFirma] = useState(0);

  // Mantener deshabilitado hasta completar
  // la seguridad y configurar el endpoint público.
  const registroPublicoHabilitado = 
  process.env.NEXT_PUBLIC_ADHESIONES_HABILITADAS === "true";

  const formularioCompleto =
    nombre.trim().length >= 2 &&
    apellido.trim().length >= 2 &&
    /^\d{7,8}$/.test(dni) &&
    domicilio.trim().length >= 5 &&
    provincia !== "" &&
    firma !== null &&
    aceptaProyecto &&
    aceptaPrivacidad &&
    turnstileToken !== null;

  async function enviarAdhesion(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !registroPublicoHabilitado ||
      !formularioCompleto ||
      enviando
    ) {
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/api/adhesiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          dni,
          domicilio: domicilio.trim(),
          provincia,
          firma,
          aceptaProyecto,
          aceptaPrivacidad,
          turnstileToken,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          resultado.mensaje ||
            "No se pudo registrar la adhesión."
        );
        return;
      }

      setRegistroExitoso(true);
      setMensaje(
        "Tu adhesión fue recibida correctamente y quedó pendiente de revisión."
      );

      // Limpiar el formulario después del éxito.
      setNombre("");
      setApellido("");
      setDni("");
      setDomicilio("");
      setProvincia("");
      setFirma(null);
      setAceptaProyecto(false);
      setAceptaPrivacidad(false);
      setClaveFirma((anterior) => anterior + 1);
    } catch {
      setMensaje(
        "No se pudo conectar con el servidor. Intentá nuevamente más tarde."
      );
    } finally {
      setEnviando(false);

      // El token Turnstile es de un solo uso.
      setTurnstileToken(null);
      setClaveTurnstile((anterior) => anterior + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
      <h2 className="text-3xl font-bold text-[#793b25]">
        Sumá tu adhesión
      </h2>

      <p className="mt-4 text-gray-600">
        Acompañá la propuesta de instituir el 3 de enero
        como Día Nacional del Jigote Belicho.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={enviarAdhesion}
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

        <div>
          <FirmaDigital
            key={claveFirma}
            onFirmar={setFirma}
          />
        </div>

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
              He leído y acepto la{" "}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#793b25] underline hover:text-[#91482d]"
              >
                Política de Privacidad
              </a>{" "}
              y autorizo el tratamiento de mis datos
              personales para registrar y administrar
              mi adhesión, incluida su eventual
              presentación ante las autoridades
              competentes.
            </span>
          </label>
        </div>

        <VerificacionTurnstile
          key={claveTurnstile}
          onVerify={setTurnstileToken}
        />

        <button
          type="submit"
          disabled={
            !registroPublicoHabilitado ||
            !formularioCompleto ||
            enviando
          }
          className="w-full rounded-xl bg-[#91482d] px-6 py-4 font-bold text-white transition hover:bg-[#743820] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando
            ? "Registrando adhesión..."
            : registroPublicoHabilitado
              ? "Registrar mi adhesión"
              : "Registro próximamente disponible"}
        </button>

        {mensaje && (
          <p
            role="status"
            className={`rounded-lg p-4 text-sm ${
              registroExitoso
                ? "bg-green-50 text-green-800"
                : "bg-amber-50 text-amber-900"
            }`}
          >
            {mensaje}
          </p>
        )}

        {!registroPublicoHabilitado && (
          <p className="text-center text-xs text-gray-500">
            El registro público todavía no está habilitado.
            Los datos ingresados no se envían ni almacenan.
          </p>
        )}
      </form>
    </div>
  );
}
