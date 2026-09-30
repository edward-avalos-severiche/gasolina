import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Sobre Nosotros</h1>
            <p className="text-lg text-gray-600 mt-4">Conoce al equipo detrás de tu éxito digital.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              En Marketing Digital, nuestra misión es empoderar a las empresas para que alcancen su máximo potencial en
              el mundo digital. Creemos que una estrategia de marketing bien ejecutada es la clave para el crecimiento y
              la sostenibilidad en el mercado actual. Nos dedicamos a ofrecer soluciones innovadoras y personalizadas
              que generen resultados tangibles para nuestros clientes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Visión</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ser el socio estratégico líder en marketing digital, reconocido por nuestra excelencia, innovación y el
              impacto positivo que generamos en el negocio de nuestros clientes. Aspiramos a construir relaciones
              duraderas basadas en la confianza, la transparencia y el éxito mutuo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestro Equipo</h2>
            <p className="text-gray-700 leading-relaxed">
              Contamos con un equipo de profesionales apasionados y experimentados en diversas áreas del marketing
              digital, incluyendo SEO, SEM, redes sociales, email marketing, diseño web y análisis de datos. Cada
              miembro de nuestro equipo está comprometido con la calidad y la mejora continua, asegurando que recibas el
              mejor servicio posible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
