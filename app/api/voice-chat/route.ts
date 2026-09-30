import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const groqModel = groq("llama-3.1-8b-instant")

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
        "Eres el asistente virtual de IA Gasolina. Responde en español, de forma clara, breve y amable. No inventes datos sobre una empresa o productos que no estén presentes en la conversación. Si te preguntan por información específica del sitio, indica que esta es una página de prueba estática.",
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
