import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

export default async function ServicesPage() {
  const { data: services, error } = await supabase
    .from("marketing_services")
    .select("*")
    .order("name", { ascending: true }) // Ordenar alfabéticamente

  if (error) {
    console.error("Error fetching services:", error)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <p className="text-red-500">Error al cargar los servicios.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Nuestros Servicios de Marketing</h1>
            <p className="text-lg text-gray-600 mt-4">
              Descubre cómo podemos ayudarte a alcanzar tus metas de marketing digital.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
