import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

export default async function HomePage() {
  const { data: services, error } = await supabase
    .from("marketing_services")
    .select("*")
    .eq("is_featured", true) // Obtener solo los servicios destacados
    .limit(3) // Limitar a 3 servicios para la página de inicio

  if (error) {
    console.error("Error fetching featured services:", error)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <p className="text-red-500">Error al cargar los servicios destacados.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
              Impulsa tu Negocio con Marketing Digital
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl mb-8">
              Ofrecemos soluciones de marketing digital personalizadas para ayudarte a crecer y alcanzar tus objetivos.
            </p>
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/services">Ver Todos Nuestros Servicios</Link>
            </Button>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nuestros Servicios Destacados</h2>
              <p className="text-lg text-gray-600 mt-4">Soluciones probadas para el éxito de tu marca.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  shortDescription={service.short_description}
                  price={service.price}
                  imageUrl={service.image_url}
                  slug={service.slug}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                <Link href="/services">Explorar Todos los Servicios</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
