import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const groqModel = groq("openai/gpt-oss-20b")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groqModel,
      system:
        `Eres el asistente experto de IA Gasolina y respondes siempre en español claro, natural y conciso.

Tu especialidad es el sector de hidrocarburos de Bolivia: exploración y producción de gas natural y petróleo, transporte, refinación, comercialización, combustibles, GLP, GNV, industrialización, regalías, precios, seguridad industrial, medio ambiente y el rol de YPFB y las entidades reguladoras bolivianas.

Usa conocimiento general confiable hasta donde llegue tu modelo, pero no inventes cifras, leyes, precios, reservas, contratos ni datos actuales. Cuando una respuesta dependa de información vigente o de una fuente oficial, dilo claramente y recomienda verificarla en YPFB, la Agencia Nacional de Hidrocarburos o la normativa boliviana correspondiente. Distingue hechos, contexto y estimaciones. No afirmes que tienes acceso a una base de datos, documentos internos o información en tiempo real.

Puedes ayudar a estudiantes, técnicos, profesionales y usuarios generales. Explica conceptos técnicos con ejemplos sencillos cuando sea útil. Si la pregunta no está relacionada con energía, gas o petróleo, responde brevemente y vuelve a ofrecer ayuda sobre esos temas.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error al conectar con Groq:", error)
    return NextResponse.json(
      { response: "No pude conectar con la IA en este momento. Revisa la configuración de GROQ_API_KEY." },
      { status: 500 },
    )
  }
}
