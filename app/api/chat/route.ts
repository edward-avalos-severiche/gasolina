import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const model = groq("openai/gpt-oss-20b")

const systemPrompt = `Eres IA Gasolina, un experto en gas, petróleo e hidrocarburos de Bolivia.
Responde en español claro, natural y útil. Dominas exploración y producción, transporte,
refinación, combustibles, GLP, GNV, industrialización, seguridad, medio ambiente,
regulación, YPFB y la Agencia Nacional de Hidrocarburos.
No inventes cifras, precios, leyes ni datos actuales. Si la respuesta depende de información
vigente, indica que debe verificarse en fuentes oficiales bolivianas. No digas que tienes una
base de datos ni simules respuestas prefabricadas. Explica términos técnicos de forma sencilla.
Para evaluaciones de combustible, entrega una orientación preliminar, nunca una certificación,
y recomienda análisis de laboratorio cuando corresponda.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const { text } = await generateText({ model, system: systemPrompt, prompt: message })
    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error al conectar con Groq:", error)
    return NextResponse.json(
      { error: "No se pudo conectar con Groq. Verifica GROQ_API_KEY en el entorno del servidor." },
      { status: 500 },
    )
  }
}
