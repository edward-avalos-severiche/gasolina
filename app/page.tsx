import VoiceAIAssistant from "@/components/voice-ai-assistant"

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010616] text-white">
      <div
        className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden="true"
      />
      <section className="relative z-10 flex flex-col items-center text-center">
        <div
          className="sphere-idle relative h-[112px] w-[112px] rounded-full"
          role="img"
          aria-label="Esfera animada del asistente de IA"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#f6fdff_0%,#9eeeff_8%,#39bde8_32%,#1265c9_67%,#071a66_100%)] shadow-[0_0_38px_rgba(30,160,255,0.32),inset_-15px_-19px_25px_rgba(1,8,45,0.5)]" />
          <div className="absolute left-[27px] top-[17px] h-[24px] w-[24px] rounded-full bg-white/60 blur-[7px]" />
        </div>
        <p className="mt-[58px] text-[8px] font-medium text-slate-500">Index estático de prueba · Sin Supabase</p>
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
void metadata
