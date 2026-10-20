
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import FormularioPrueba from "@/components/adhesiones/FormularioPrueba";


export default async function ProbarAdhesionPage() {
  // Esta página solamente funciona en desarrollo.
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: administrador, error: adminError } =
    await supabase
      .from("administradores")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (adminError || !administrador) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-5 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#793b25]">
          Prueba de adhesiones
        </h1>

        <p className="mt-4 text-gray-700">
          Esta sección está reservada para probar el
          registro de adhesiones con datos ficticios.
        </p>

        <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Modo de desarrollo. No utilizar datos
          personales ni firmas reales.
        </p>
        
        <FormularioPrueba />


        <a
          href="/admin"
          className="mt-6 inline-block rounded-lg bg-[#793b25] px-5 py-3 font-semibold text-white"
        >
          Volver al panel
        </a>
      </div>
    </main>
  );
}
