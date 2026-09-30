import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { supabase } from "@/lib/supabase"

const groqModel = groq("llama3-8b-8192")

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const userPrompt = message
    const lowerCaseMessage = message.toLowerCase()

    // --- Fetch Services ---
    const { data: allServices, error: servicesError } = await supabase
      .from("marketing_services")
      .select("name, description, short_description, slug, price")

    if (servicesError) {
      console.error("Error fetching services from Supabase:", servicesError)
    }

    // --- Fetch Projects ---
    const { data: allProjects, error: projectsError } = await supabase
      .from("marketing_projects")
      .select("title, short_description, description, solution, slug, company_name")

    if (projectsError) {
      console.error("Error fetching projects from Supabase:", projectsError)
    }

    // --- Fetch Contact Info ---
    const { data: contactInfo, error: contactError } = await supabase.from("contact_info").select("*").single()

    if (contactError) {
      console.error("Error fetching contact info from Supabase:", contactError)
    }

    let aiResponseText = ""
    let foundData = false

    // --- Lógica para Contactos ---
    if (
      lowerCaseMessage.includes("contacto") ||
      lowerCaseMessage.includes("dirección") ||
      lowerCaseMessage.includes("teléfono") ||
      lowerCaseMessage.includes("email") ||
      lowerCaseMessage.includes("whatsapp") ||
      lowerCaseMessage.includes("ubicación")
    ) {
      if (contactInfo) {
        const contactDetails = `Nuestra dirección es ${contactInfo.address}. Puedes llamarnos al ${contactInfo.phone_fixed} o enviarnos un WhatsApp al ${contactInfo.phone_whatsapp}. Nuestro correo electrónico es ${contactInfo.email}.`
        // Añadimos la sugerencia para usar el formulario de contacto
        const formSuggestion = `Si prefieres, también puedes enviarnos un mensaje directamente a través del formulario de contacto en nuestra página web.`
        const contactPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. El usuario te ha preguntado sobre nuestra información de contacto. Aquí tienes los detalles: ${contactDetails} ${formSuggestion}. Por favor, responde de manera concisa y útil, proporcionando la información solicitada. No inventes información. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
        const { text } = await generateText({
          model: groqModel,
          system: contactPrompt,
          prompt: userPrompt,
        })
        aiResponseText = text
        foundData = true
      } else {
        const noContactPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. Lo siento, no tengo la información de contacto disponible en este momento. Por favor, intenta más tarde. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
        const { text } = await generateText({
          model: groqModel,
          system: noContactPrompt,
          prompt: userPrompt,
        })
        aiResponseText = text
        foundData = true
      }
    }

    // --- Lógica para Proyectos (solo si no se encontró información de contacto) ---
    if (
      !foundData &&
      (lowerCaseMessage.includes("proyecto") ||
        lowerCaseMessage.includes("casos de éxito") ||
        lowerCaseMessage.includes("trabajos realizados"))
    ) {
      if (allProjects && allProjects.length > 0) {
        let specificProject = null
        specificProject = allProjects.find(
          (project) =>
            lowerCaseMessage.includes(project.title.toLowerCase()) ||
            lowerCaseMessage.includes(project.slug.toLowerCase()) ||
            lowerCaseMessage.includes(project.company_name.toLowerCase()),
        )

        if (specificProject) {
          const specificProjectPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. Tu objetivo es proporcionar información **estrictamente basada en los datos que te proporciono sobre el proyecto solicitado**. No inventes ni infieras información que no esté explícitamente en el contexto. Sé conciso y directo. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**

          Información del proyecto solicitado:
          Título: ${specificProject.title}
          Empresa: ${specificProject.company_name}
          Descripción corta: ${specificProject.short_description}
          Descripción completa: ${specificProject.description}
          Solución: ${specificProject.solution}
          Slug: ${specificProject.slug}
          `
          const { text } = await generateText({
            model: groqModel,
            system: specificProjectPrompt,
            prompt: userPrompt,
          })
          aiResponseText = text
          foundData = true
        } else {
          const projectTitles = allProjects.map((p) => `${p.title} para ${p.company_name}`).join(", ")
          const generalProjectsPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. El usuario te ha preguntado sobre nuestros proyectos. Aquí tienes algunos de nuestros proyectos destacados: ${projectTitles}. Por favor, responde de manera concisa y útil, mencionando los proyectos y las empresas si es relevante para la pregunta del usuario. No inventes información. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
          const { text } = await generateText({
            model: groqModel,
            system: generalProjectsPrompt,
            prompt: userPrompt,
          })
          aiResponseText = text
          foundData = true
        }
      } else {
        const noProjectsPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. Lo siento, no tengo información sobre proyectos en este momento. ¿Hay algo más en lo que pueda ayudarte? **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
        const { text } = await generateText({
          model: groqModel,
          system: noProjectsPrompt,
          prompt: userPrompt,
        })
        aiResponseText = text
        foundData = true
      }
    }

    // --- Lógica para Servicios (solo si no se encontró información de contacto ni proyectos) ---
    if (
      !foundData &&
      (lowerCaseMessage.includes("servicio") ||
        lowerCaseMessage.includes("precio") ||
        lowerCaseMessage.includes("costo") ||
        lowerCaseMessage.includes("cuánto") ||
        lowerCaseMessage.includes("qué ofrecen") ||
        lowerCaseMessage.includes("lista de servicios"))
    ) {
      if (allServices && allServices.length > 0) {
        let foundService = null
        foundService = allServices.find(
          (service) =>
            lowerCaseMessage.includes(service.name.toLowerCase()) ||
            lowerCaseMessage.includes(service.slug.toLowerCase()) ||
            lowerCaseMessage.includes(service.short_description.toLowerCase()),
        )

        if (foundService) {
          const specificServicePrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. Tu objetivo es proporcionar información **estrictamente basada en los datos que te proporciono sobre el servicio solicitado**. No inventes ni infieras información que no esté explícitamente en el contexto. Cuando menciones precios, hazlo **solo con el número y la moneda (ej. '1200 dólares')**, no intentes convertirlo a palabras ni añadir 'punto cero' ni 'con cero centavos'. Sé conciso y directo. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**

          Información del servicio solicitado:
          Nombre: ${foundService.name}
          Descripción: ${foundService.description}
          Descripción corta: ${foundService.short_description}
          Precio: ${foundService.price.toFixed(2)} dólares
          Slug: ${foundService.slug}
          `
          const { text } = await generateText({
            model: groqModel,
            system: specificServicePrompt,
            prompt: userPrompt,
          })
          aiResponseText = text
          foundData = true
        } else {
          const servicesList = allServices.map((s) => `${s.name} por ${s.price.toFixed(2)} dólares`).join(", ")

          const generalInfoPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. El usuario te ha preguntado sobre nuestros servicios o precios en general. Aquí tienes una lista de nuestros servicios con sus precios: ${servicesList}. Por favor, responde de manera concisa y útil, mencionando los servicios y sus precios si es relevante para la pregunta del usuario. Cuando menciones precios, hazlo **solo con el número y la moneda (ej. '1200 dólares')**, no intentes convertirlo a palabras ni añadir 'punto cero' ni 'con cero centavos'. No inventes información. **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`

          const { text } = await generateText({
            model: groqModel,
            system: generalInfoPrompt,
            prompt: userPrompt,
          })
          aiResponseText = text
          foundData = true
        }
      } else {
        const noServicesPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. Lo siento, no tengo información sobre servicios en este momento. ¿Hay algo más en lo que pueda ayudarte? **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
        const { text } = await generateText({
          model: groqModel,
          system: noServicesPrompt,
          prompt: userPrompt,
        })
        aiResponseText = text
        foundData = true
      }
    }

    // --- Respuesta por defecto si no se encontró información relevante en ninguna categoría ---
    if (!foundData) {
      const defaultPrompt = `Eres un asistente virtual amigable, informal y cercano, experto en marketing digital. No encontré información específica sobre tu consulta en nuestra base de datos. Puedo ayudarte con información sobre nuestros productos, servicios, soporte técnico, políticas, y nuestros proyectos. ¿Sobre qué tema específico te gustaría saber más? **No hagas preguntas de seguimiento ni ofrezcas ayuda adicional.**`
      const { text } = await generateText({
        model: groqModel,
        system: defaultPrompt,
        prompt: userPrompt,
      })
      aiResponseText = text
    }

    return NextResponse.json({ response: aiResponseText })
  } catch (error) {
    console.error("Error en voice chat API con Groq:", error)
    return NextResponse.json(
      {
        response: "Lo siento, hubo un problema técnico al conectar con la IA. ¿Podrías repetir tu pregunta por favor?",
      },
      { status: 500 },
    )
  }
}
