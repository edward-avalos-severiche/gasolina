"use server"

interface ContactFormState {
  success: boolean
  message: string
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Aquí iría la lógica real para enviar el email, por ejemplo, usando un servicio de terceros
  // Por ahora, solo simularemos el envío.
  console.log("Nuevo mensaje de contacto recibido:")
  console.log(`Nombre: ${name}`)
  console.log(`Email: ${email}`)
  console.log(`Mensaje: ${message}`)

  // Simular un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (!name || !email || !message) {
    return { success: false, message: "Por favor, completa todos los campos." }
  }

  // Aquí podrías añadir validaciones de email, etc.

  return { success: true, message: "¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto." }
}
