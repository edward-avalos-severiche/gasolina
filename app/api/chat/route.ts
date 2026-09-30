import { type NextRequest, NextResponse } from "next/server"

// Base de conocimiento simulada
const knowledgeBase = {
  productos: [
    "Ofrecemos una amplia gama de productos de alta calidad incluyendo electrónicos, ropa, hogar y más.",
    "Todos nuestros productos cuentan con garantía y envío gratuito en compras superiores a $50.",
    "Puedes encontrar productos en categorías como tecnología, moda, hogar, deportes y belleza.",
  ],
  servicios: [
    "Brindamos servicios de atención al cliente 24/7, soporte técnico especializado y asesoría personalizada.",
    "Nuestros servicios incluyen instalación, mantenimiento, capacitación y consultoría.",
    "Ofrecemos planes de servicio premium con beneficios exclusivos para nuestros clientes.",
  ],
  soporte: [
    "Nuestro equipo de soporte está disponible las 24 horas del día, los 7 días de la semana.",
    "Puedes contactarnos por chat, teléfono, email o a través de nuestras redes sociales.",
    "Tiempo promedio de respuesta: 2 minutos por chat, 1 hora por email.",
  ],
  politicas: [
    "Nuestra política de devoluciones permite devolver productos hasta 30 días después de la compra.",
    "Respetamos tu privacidad y nunca compartimos tu información personal con terceros.",
    "Todos los pagos son procesados de forma segura con encriptación SSL.",
  ],
}

function findRelevantInfo(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("producto") || lowerQuery.includes("comprar") || lowerQuery.includes("catálogo")) {
    return knowledgeBase.productos[Math.floor(Math.random() * knowledgeBase.productos.length)]
  }
  if (lowerQuery.includes("servicio") || lowerQuery.includes("ayuda") || lowerQuery.includes("asistencia")) {
    return knowledgeBase.servicios[Math.floor(Math.random() * knowledgeBase.servicios.length)]
  }
  if (lowerQuery.includes("soporte") || lowerQuery.includes("contacto") || lowerQuery.includes("teléfono")) {
    return knowledgeBase.soporte[Math.floor(Math.random() * knowledgeBase.soporte.length)]
  }
  if (lowerQuery.includes("política") || lowerQuery.includes("devolución") || lowerQuery.includes("privacidad")) {
    return knowledgeBase.politicas[Math.floor(Math.random() * knowledgeBase.politicas.length)]
  }

  return "Gracias por tu consulta. Puedo ayudarte con información sobre nuestros productos, servicios, soporte técnico y políticas. ¿Sobre qué tema específico te gustaría saber más?"
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    // Buscar información relevante
    const relevantInfo = findRelevantInfo(message)

    // Simular tiempo de procesamiento de IA
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = `${relevantInfo} ¿Hay algo más específico en lo que pueda ayudarte?`

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error en chat API:", error)
    return NextResponse.json(
      {
        error: "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.",
      },
      { status: 500 },
    )
  }
}
