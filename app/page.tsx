
import FormularioAdhesion from "@/components/adhesiones/FormularioAdhesion";
import Link from "next/link";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#382b22]">
      {/* NavegaciÃ³n */}
      <header className="border-b border-[#e8dccb] bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="text-xl font-extrabold text-[#91482d]">
            JIGOTE BELICHO
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm font-semibold">
            <a href="#historia">Historia</a>
            <a href="#proyecto">Proyecto de ley</a>
            <a href="#adhesiones">Adhesiones</a>
          </div>
        </nav>
      </header>

      {/* Portada */}
      <section className="bg-gradient-to-br from-[#f4e2c9] to-[#faf7f0] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-[#91482d] px-5 py-2 text-sm font-semibold text-white">
            Belén · Catamarca · Argentina
          </span>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight text-[#793b25] md:text-6xl">
            Día Nacional del Jigote Belicho
          </h1>

          <p className="mt-6 text-xl text-[#63554b]">
            Una tradición gastronómica que representa nuestra
            historia, nuestra cultura y nuestra identidad.
          </p>

          <p className="mt-5 text-lg font-bold">
            Propuesta: 3 de enero de cada año
          </p>

          <a
            href="#adhesiones"
            className="mt-9 inline-block rounded-xl bg-[#91482d] px-8 py-4 font-bold text-white transition hover:bg-[#743820]"
          >
            Conocer la iniciativa
          </a>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold text-[#793b25]">
            Nuestra historia y tradición
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#63554b]">
            El Jigote Belicho es una expresión de la identidad
            gastronómica y cultural de Belén, Catamarca.
            Su preparación tradicional conserva saberes,
            costumbres y técnicas transmitidas de generación
            en generación.
          </p>

          <p className="mt-5 text-lg leading-8 text-[#63554b]">
            Preservar esta tradición significa reconocer a
            las familias, cocineras y cocineros que han
            mantenido viva una parte de nuestra historia.
          </p>
        </div>
      </section>

      {/* Proyecto */}
      <section id="proyecto" className="bg-[#efe4d4] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold text-[#793b25]">
            Proyecto de reconocimiento nacional
          </h2>

          <p className="mt-6 text-lg leading-8">
            La iniciativa propone instituir el 3 de enero
            como Día Nacional del Jigote Belicho, con el
            propósito de reconocer, preservar y difundir
            esta tradición cultural.
          </p>

          <div className="mt-8 rounded-xl border border-[#d8c3a8] bg-white p-6">
            <h3 className="text-xl font-bold">
              Objetivos de la iniciativa
            </h3>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Reconocer su valor cultural y gastronómico.</li>
              <li>Promover la preservación de las recetas tradicionales.</li>
              <li>Difundir la identidad cultural de Belén.</li>
              <li>Promover actividades educativas y culturales.</li>
              <li>Reconocer a quienes mantienen viva la tradición.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Adhesiones */}
      <section id="adhesiones" className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold text-[#793b25]">
            Adhesiones ciudadanas
          </h2>

          <p className="mt-5 text-lg text-[#63554b]">
            Buscamos reunir el apoyo de personas de todo el
            territorio argentino para acompañar esta
            propuesta cultural.
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#e8dccb] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#91482d]">
              Nuestra primera meta
            </p>

            <p className="mt-4 text-6xl font-extrabold text-[#793b25]">
              1.500
            </p>

            <p className="mt-3 text-lg">Adhesiones ciudadanas</p>

            <div className="mt-7 h-4 overflow-hidden rounded-full bg-[#e8dccb]">
              <div className="h-full w-0 bg-[#91482d]" />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              El registro de adhesiones estará disponible próximamente.
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-6 text-gray-600">
            Las adhesiones ciudadanas no constituyen por sí
            mismas firmas electorales certificadas conforme
            a la Ley Nacional 24.747.
          </p>
        </div>
        
        <div className="mt-12">
          <FormularioAdhesion />
        </div>

      </section>

      {/* Pie de pÃ¡gina */}
      <footer className="bg-[#382b22] px-6 py-8 text-center text-sm text-white">
        <p className="font-bold">
          Día Nacional del Jigote Belicho
        </p>
        <p className="mt-2 text-[#dec9b6]">
          Belén, Catamarca, Argentina
        </p>
        <p className="mt-3 text-[#dec9b6]">
          Iniciativa cultural para la preservación de nuestras tradiciones.
        </p>
      </footer>
    </main>
  );
}

