import Link from "next/link"

export function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
      <Link className="flex items-center justify-center" href="/">
        <span className="text-lg font-bold text-blue-600">Marketing Digital</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          Inicio
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/services">
          Servicios
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/projects">
          Nuestros Proyectos
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
          Nosotros
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
          {" "}
          {/* Nueva línea */}
          Contactos {/* Nueva línea */}
        </Link>{" "}
        {/* Nueva línea */}
      </nav>
    </header>
  )
}
