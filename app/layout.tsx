import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "IA Gasolina",
  description: "Index estático de prueba con asistente de IA.",
  generator: "Next.js",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${GeistSans.className} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
