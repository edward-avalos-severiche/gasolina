import VoiceAIAssistant from "@/components/voice-ai-assistant"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,0.18),transparent_42%)]" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">IA Gasolina</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Una experiencia estática preparada para tu asistente de IA
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Esta es una página de prueba sin base de datos. Abre la esfera de la esquina inferior derecha para conversar con Groq.
          </p>
          <div className="mx-auto mt-12 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_32%_24%,#fff_0%,#a5f3fc_8%,#38bdf8_30%,#2563eb_65%,#172554_100%)] shadow-[0_0_100px_rgba(34,211,238,0.35),inset_-20px_-24px_50px_rgba(15,23,42,0.55)] motion-safe:animate-pulse" aria-label="Esfera animada de IA" role="img" />
          <p className="mt-8 text-sm text-slate-400">Index estático de prueba · Sin Supabase</p>
        </div>
      </section>
      <VoiceAIAssistant />
    </main>
  )
}

export const dynamic = "force-static"
export const revalidate = false
export const metadata = {
  title: "IA Gasolina",
  description: "Index estático de prueba con asistente de IA.",
}
// Metadata is exported from the page only to keep this static prototype self-contained.
void metadata
