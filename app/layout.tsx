
import type { Metadata } from "next";
import "./globals.css";

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
