import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params

  const { data: project, error } = await supabase.from("marketing_projects").select("*").eq("slug", slug).single()

  if (error || !project) {
    console.error("Error fetching project or project not found:", error)
    notFound() // Muestra la página 404 de Next.js
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              alt={project.title}
              className="w-full h-64 object-cover"
              height={400}
              src={project.image_url || "/placeholder.svg"}
              style={{
                aspectRatio: "800/400",
                objectFit: "cover",
              }}
              width={800}
            />
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{project.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{project.company_name}</p> {/* Añade esta línea */}
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <h2 className="text-xl font-semibold mt-8 mb-4">Descripción del Proyecto</h2>
                <p>{project.description}</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">Nuestra Solución</h2>
                <p>{project.solution}</p>
              </div>
              <div className="mt-8">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                  <Link href="/projects">Volver a Proyectos</Link>
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
