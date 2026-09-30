import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("marketing_projects")
    .select("*")
    .order("created_at", { ascending: false }) // Ordenar por los más recientes

  if (error) {
    console.error("Error fetching projects:", error)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <p className="text-red-500">Error al cargar los proyectos.</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Nuestros Proyectos Realizados</h1>
            <p className="text-lg text-gray-600 mt-4">
              Casos de éxito que demuestran nuestro impacto en el marketing digital.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                shortDescription={project.short_description}
                imageUrl={project.image_url}
                slug={project.slug}
                companyName={project.company_name} // Línea corregida
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
