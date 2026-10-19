
export type DatosAdhesion = {
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  provincia: string;
  firma: string;
  aceptaProyecto: boolean;
  aceptaPrivacidad: boolean;
  turnstileToken: string;
};

export function validarAdhesion(
  datos: unknown
): datos is DatosAdhesion {
  if (
    typeof datos !== "object" ||
    datos === null ||
    Array.isArray(datos)
  ) {
    return false;
  }

  const d = datos as Record<string, unknown>;

  return (
    typeof d.nombre === "string" &&
    d.nombre.trim().length >= 2 &&
    d.nombre.trim().length <= 80 &&

    typeof d.apellido === "string" &&
    d.apellido.trim().length >= 2 &&
    d.apellido.trim().length <= 80 &&

    typeof d.dni === "string" &&
    /^\d{7,8}$/.test(d.dni) &&

    typeof d.domicilio === "string" &&
    d.domicilio.trim().length >= 5 &&
    d.domicilio.trim().length <= 180 &&

    typeof d.provincia === "string" &&
    d.provincia.trim().length > 0 &&
    d.provincia.trim().length <= 80 &&

    typeof d.firma === "string" &&
    d.firma.startsWith("data:image/png;base64,") &&

    d.aceptaProyecto === true &&
    d.aceptaPrivacidad === true &&

    typeof d.turnstileToken === "string" &&
    d.turnstileToken.length > 0
  );
}
