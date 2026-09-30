import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { MapPin, Phone, Smartphone, Mail } from "lucide-react"
import { ContactForm } from "@/components/contact-form" // Importa el nuevo componente

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

export default async function ContactPage() {
  const { data: contactInfo, error } = await supabase.from("contact_info").select("*").single() // Esperamos un solo registro de información de contacto

  if (error || !contactInfo) {
    console.error("Error fetching contact info:", error)
    // Puedes manejar este error mostrando un mensaje o un formulario sin datos pre-cargados
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <p className="text-red-500">Error al cargar la información de contacto.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Contáctanos</h1>
            <p className="text-lg text-gray-600 mt-4">
              Estamos aquí para ayudarte. Envíanos un mensaje o encuéntranos en nuestras oficinas.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sección de Detalles de Contacto */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Información</h2>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Dirección</h3>
                  <p className="text-gray-700">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Teléfono Fijo</h3>
                  <p className="text-gray-700">{contactInfo.phone_fixed}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Smartphone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                  <p className="text-gray-700">{contactInfo.phone_whatsapp}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Correo Electrónico</h3>
                  <p className="text-gray-700">{contactInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Sección del Formulario de Contacto */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Envíanos un Mensaje</h2>
              <ContactForm /> {/* Usa el componente del formulario */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
