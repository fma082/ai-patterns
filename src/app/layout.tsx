import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter es variable font: cubre los pesos que usamos (400 regular, 500 medium)
// sin cargar archivos extra. Se expone como CSS var y se aplica en <html>.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Interface Patterns",
  description:
    "Librería de patrones de UI para interfaces con AI. Sistema monocromo, light + dark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
