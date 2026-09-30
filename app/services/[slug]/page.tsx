import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

interface ServiceDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = params

  const { data: service, error } = await supabase.from("marketing_services").select("*").eq("slug", slug).single() // Esperamos un solo resultado

  if (error || !service) {
    console.error("Error fetching service or service not found:", error)
    notFound() // Muestra la página 404 de Next.js
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              alt={service.name}
              className="w-full h-64 object-cover"
              height={400}
              src={service.image_url || "/placeholder.svg"}
              style={{
                aspectRatio: "800/400",
                objectFit: "cover",
              }}
              width={800}
            />
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{service.name}</h1>
              <p className="text-2xl font-semibold text-blue-700 mb-6">${service.price.toFixed(2)}</p>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>{service.description}</p>
                {/* Puedes añadir más detalles o secciones aquí */}
                <h2 className="text-xl font-semibold mt-8 mb-4">¿Qué incluye este servicio?</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Análisis inicial y estrategia personalizada.</li>
                  <li>Implementación y optimización continua.</li>
                  <li>Reportes de rendimiento y reuniones de seguimiento.</li>
                  <li>Soporte dedicado de nuestro equipo de expertos.</li>
                </ul>
              </div>
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                  Contactar para este Servicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
