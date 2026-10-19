
import type { Metadata } from "next";
import "./globals.css";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const metadata: Metadata = {
  title: "Día Nacional del Jigote Belicho | Belén, Catamarca",

  description:
    "Iniciativa para declarar el 3 de enero como Día Nacional del Jigote Belicho. Conocé su historia, tradición y propuesta de reconocimiento cultural.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

