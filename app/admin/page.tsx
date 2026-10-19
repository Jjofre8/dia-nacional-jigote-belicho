
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Adhesion = {
  id: string;
  nombre: string;
  apellido: string;
  provincia: string;
  estado: string;
  fecha_adhesion: string;
};

export default async function AdminPage() {
  const supabase = createClient();

  // Verificar identidad.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Verificar que tenga permisos administrativos.
  const { data: admin, error: adminError } = await supabase
    .from("administradores")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/");
  }

  // Consultar adhesiones.
  const { data, error } = await supabase
    .from("adhesiones")
    .select(
      "id, nombre, apellido, provincia, estado, fecha_adhesion"
    )
    .order("fecha_adhesion", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error al consultar adhesiones:", error.message);
  }

  const adhesiones = (data ?? []) as Adhesion[];

  // Estadísticas globales, calculadas en Supabase.
  const [totalResult, aprobadasResult, pendientesResult] =
    await Promise.all([
      supabase
        .from("adhesiones")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("adhesiones")
        .select("*", { count: "exact", head: true })
        .eq("estado", "aprobada"),

      supabase
        .from("adhesiones")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendiente"),
    ]);

  const estadisticasConError = [
    totalResult,
    aprobadasResult,
    pendientesResult,
  ].some((resultado) => resultado.error);

  const total = totalResult.count ?? 0;
  const aprobadas = aprobadasResult.count ?? 0;
  const pendientes = pendientesResult.count ?? 0;

  const progreso = Math.min(
    (aprobadas / 1500) * 100,
    100
  );

  return (
    <main className="min-h-screen bg-[#faf7f0] p-6 text-[#382b22]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-[#91482d]">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Día Nacional del Jigote Belicho
          </h1>

          <p className="mt-3 text-gray-600">
            Gestión de adhesiones ciudadanas.
          </p>
        </header>

        {error || estadisticasConError ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            No se pudieron consultar todos los datos.
            Revisá la conexión y los permisos de Supabase.
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Adhesiones registradas
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {total}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Adhesiones aprobadas
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {aprobadas}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Adhesiones pendientes
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {pendientes}
            </h2>
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Objetivo: 1.500 adhesiones
          </h2>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#e8dccb]">
            <div
              className="h-full rounded-full bg-[#91482d]"
              style={{ width: `${progreso}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-600">
            {aprobadas} de 1.500 adhesiones aprobadas
            ({progreso.toFixed(1)}%)
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold">
              Últimas adhesiones
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Se muestran hasta 100 registros recientes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#efe4d4]">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Apellido</th>
                  <th className="p-4">Provincia</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {adhesiones.map((adhesion) => (
                  <tr
                    key={adhesion.id}
                    className="border-t"
                  >
                    <td className="p-4">{adhesion.nombre}</td>
                    <td className="p-4">{adhesion.apellido}</td>
                    <td className="p-4">{adhesion.provincia}</td>
                    <td className="p-4">{adhesion.estado}</td>
                    <td className="p-4">
                      {new Date(
                        adhesion.fecha_adhesion
                      ).toLocaleDateString("es-AR", {
                        timeZone: "America/Argentina/Buenos_Aires",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adhesiones.length === 0 && !error && (
            <p className="p-6 text-center text-gray-500">
              Todavía no hay adhesiones registradas.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
