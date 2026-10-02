"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Fuel, HelpCircle, X, Mic, MicOff, Square } from "lucide-react"
import { numberToWordsEs } from "@/utils/number-to-words"

export default function VoiceAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasGreetedThisSession, setHasGreetedThisSession] = useState(false)
  const [hasSpokenCurrentGreeting, setHasSpokenCurrentGreeting] = useState(false)
  const [isFuelFormOpen, setIsFuelFormOpen] = useState(false)
  const [fuelResult, setFuelResult] = useState("")
  const [isEvaluatingFuel, setIsEvaluatingFuel] = useState(false)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentTranscriptRef = useRef<string>("") // Para acumular la transcripción
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Temporizador de silencio
  const SILENCE_THRESHOLD_MS = 4000 // 4 segundos de silencio para considerar que el usuario terminó de hablar
  const CONFIDENCE_THRESHOLD = 0.7 // Umbral de confianza para considerar que es voz humana

  // Función para reiniciar el temporizador de silencio
  const resetSilenceTimeout = () => {
    clearSilenceTimeout()
    silenceTimeoutRef.current = setTimeout(() => {
      // Si el temporizador expira, significa que hubo una pausa larga en *voz humana detectada*
      // Esto es un fallback si onaudioend no se dispara por alguna razón.
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop() // Detener el reconocimiento, lo que activará onend
      }
    }, SILENCE_THRESHOLD_MS)
  }

  // Función para limpiar el temporizador de silencio
  const clearSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
  }

  // Inicializar APIs de voz
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition() as any
        recognitionRef.current.continuous = true // Escucha continuamente
        recognitionRef.current.interimResults = false // Solo resultados finales para procesar

        recognitionRef.current.lang = "es-ES"

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let hasHighConfidenceSpeech = false

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript
              const confidence = event.results[i][0].confidence

              if (confidence >= CONFIDENCE_THRESHOLD) {
                finalTranscript += transcript
                hasHighConfidenceSpeech = true
              }
            }
          }

          if (hasHighConfidenceSpeech) {
            // Solo reiniciar el temporizador si se detecta voz con alta confianza
            currentTranscriptRef.current += finalTranscript // Acumular la transcripción final
            resetSilenceTimeout() // Reiniciar el temporizador de silencio con cada nueva voz detectada
          }
          // Si se detecta algo pero con baja confianza (posiblemente ruido),
          // no reiniciar el temporizador de silencio para que se detenga si no hay voz real.
        }

        recognitionRef.current.onaudiostart = () => {
          // Cuando el micrófono empieza a detectar CUALQUIER sonido, reiniciamos el temporizador.
          // Esto asegura que el temporizador no expire si hay ruido pero no voz humana.
          resetSilenceTimeout()
        }

        recognitionRef.current.onaudioend = () => {
          // Cuando el micrófono deja de detectar CUALQUIER sonido, detenemos el reconocimiento.
          // Esto es el disparador principal para procesar la transcripción acumulada.
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop() // Esto activará onend
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false) // Asegurar que el estado de escucha se desactive en caso de error
          clearSilenceTimeout() // Limpiar cualquier temporizador pendiente
          if (event.error !== "no-speech" && event.error !== "aborted") {
            speakText("Lo siento, no pude entenderte bien. ¿Podrías repetir tu pregunta?")
          }
        }

        recognitionRef.current.onend = () => {
          // Este evento se dispara cuando el servicio de reconocimiento se desconecta (por stop() o timeout del navegador)
          setIsListening(false)
          clearSilenceTimeout() // Asegurar que el temporizador se limpie

          // Si hay transcripción acumulada, procesarla ahora
          if (currentTranscriptRef.current.trim() !== "") {
            handleUserSpeech(currentTranscriptRef.current)
            currentTranscriptRef.current = "" // Limpiar para la próxima sesión
          }
        }
      }

      synthRef.current = window.speechSynthesis

      const greeted = sessionStorage.getItem("aiGreeted") === "true"
      setHasGreetedThisSession(greeted)
    }
  }, []) // Dependencias vacías para que se ejecute solo una vez al montar

  // Saludo inicial cuando se abre
  useEffect(() => {
    if (isOpen && !hasSpokenCurrentGreeting) {
      const greetingMessage = hasGreetedThisSession
        ? "¿Te puedo ayudar en algo más?"
        : "¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta sobre nuestro sitio web. ¿En qué puedo ayudarte hoy?"

      setTimeout(() => {
        speakText(greetingMessage)
        setHasSpokenCurrentGreeting(true)
        if (!hasGreetedThisSession) {
          setHasGreetedThisSession(true)
          sessionStorage.setItem("aiGreeted", "true")
        }
      }, 1000)
    }
  }, [isOpen, hasGreetedThisSession, hasSpokenCurrentGreeting])

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 1.05 // Ligeramente más rápido para un tono más alegre
      utterance.pitch = 1.1 // Ligeramente más alto para un tono más alegre
      utterance.volume = 1

      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(
        (voice) =>
          voice.lang === "es-ES" &&
          (voice.name.includes("Google") ||
            voice.name.includes("Microsoft") ||
            voice.name.includes("Natural") ||
            voice.name.includes("Neural")),
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      } else {
        const defaultSpanishVoice = voices.find((voice) => voice.lang === "es-ES")
        if (defaultSpanishVoice) {
          utterance.voice = defaultSpanishVoice
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const handleUserSpeech = async (userText: string) => {
    try {
      const response = await fetch("/api/voice-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      })

      const data = await response.json()

      if (data.response) {
        let processedResponse = data.response

        // Regex para detectar números que podrían ser precios
        const priceRegex = /(\$?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:dólares|usd|euros)?/gi

        processedResponse = processedResponse.replace(priceRegex, (match: string, p1: string) => {
          const cleanNumber = p1.replace(/[$,]/g, "").replace(",", ".")
          const num = Number.parseFloat(cleanNumber)

          if (!isNaN(num)) {
            const words = numberToWordsEs(num)
            // Asegurarse de que la moneda se añada si estaba en el texto original o si es un precio
            if (match.toLowerCase().includes("dólares") || match.toLowerCase().includes("usd") || match.includes("$")) {
              return `${words} dólares`
            } else if (match.toLowerCase().includes("euros")) {
              return `${words} euros`
            }
            return words // Si no se especifica moneda, solo el número en palabras
          }
          return match // Si no es un número válido, devolver el match original
        })

        setTimeout(() => {
          speakText(processedResponse)
        }, 500)
      }
    } catch (error) {
      speakText("Lo siento, hubo un problema al procesar tu consulta. ¿Podrías repetir tu pregunta?")
    }
  }

  const evaluateFuel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries())
    const prompt = `Evalúa preliminarmente esta muestra de gasolina en Bolivia con criterio técnico del sector de hidrocarburos. No certifiques oficialmente el combustible y recomienda laboratorio cuando corresponda. Responde primero exactamente "Gasolina Buena", "Gasolina Basura" o "Requiere Revisión", y luego explica brevemente. Datos: octanaje RON: ${values.octanaje || "sin medición"}; densidad: ${values.densidad || "sin medición"}; apariencia: ${values.apariencia}; agua: ${values.agua}; sedimentos: ${values.sedimentos}; gomas: ${values.gomas}; laboratorio: ${values.laboratorio}.`

    // Cambiar inmediatamente a la vista de voz para que la esfera acompañe todo el análisis.
    setIsFuelFormOpen(false)
    setFuelResult("")
    setIsEvaluatingFuel(true)
    setHasSpokenCurrentGreeting(true)
    setIsOpen(true)
    try {
      const response = await fetch("/api/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      })
      const data = await response.json()
      const result = data.response || "No se pudo evaluar la muestra."
      setFuelResult(result)
      speakText(result)
    } catch {
      const fallback = "No se pudo conectar con Groq. Revisa la configuración del servidor."
      setFuelResult(fallback)
      speakText(fallback)
    } finally {
      setIsEvaluatingFuel(false)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      currentTranscriptRef.current = "" // Limpiar transcripción anterior
      setIsListening(true)
      recognitionRef.current.start()
      resetSilenceTimeout() // Iniciar el temporizador de silencio
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop() // Esto activará onend
      clearSilenceTimeout() // Asegurar que el temporizador se limpie
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    setIsOpen(false)
    setIsSpeaking(false)
    setIsListening(false)
    setHasSpokenCurrentGreeting(false)
    clearSilenceTimeout() // Asegurar que el temporizador se limpie al cerrar
  }

  return (
    <>
      {/* Botón de ayuda flotante */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-11 w-11 rounded-full bg-blue-500 shadow-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-xl sm:h-12 sm:w-12"
          size="icon"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
        <Button
          onClick={() => setIsFuelFormOpen(true)}
          aria-label="Evaluar gasolina"
          className="h-11 w-11 rounded-full bg-amber-500 shadow-lg transition-all hover:bg-amber-600 hover:shadow-xl sm:h-12 sm:w-12"
          size="icon"
        >
          <Fuel className="h-6 w-6 text-white" />
        </Button>
      </div>

      {isFuelFormOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <section className="mx-auto my-2 max-w-3xl rounded-2xl bg-slate-50 p-4 text-slate-900 shadow-2xl sm:my-4 sm:p-8" aria-labelledby="fuel-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 id="fuel-title" className="text-xl font-bold leading-tight sm:text-3xl">Evaluación Preliminar de Gasolina</h1>
                <p className="mt-2 text-sm text-slate-600">Introduzca los datos de la muestra. Cada campo contiene una explicación para ayudarle a interpretar el resultado.</p>
              </div>
              <Button type="button" onClick={() => setIsFuelFormOpen(false)} variant="ghost" size="icon" aria-label="Cerrar evaluación">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={evaluateFuel} className="mt-6 space-y-5">
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 sm:p-5">
                <h2 className="text-base font-bold leading-snug text-emerald-700 sm:text-lg">Datos que pueden indicar una gasolina en condiciones adecuadas</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">1. Octanaje RON
                    <span className="mt-2 block text-xs font-normal text-slate-600">Introduzca el número RON medido. El octanaje indica la resistencia a la detonación. Como referencia, 50 es extremadamente bajo y 95 es elevado; compare siempre con la especificación del producto.</span>
                    <input name="octanaje" type="number" min="0" placeholder="Ejemplo: 95" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal" />
                  </label>
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">2. Densidad del combustible
                    <span className="mt-2 block text-xs font-normal text-slate-600">La densidad ayuda a detectar diferencias frente a la especificación. Dentro del rango puede ser compatible; fuera requiere investigación; sin medición no es posible evaluarla.</span>
                    <input name="densidad" type="number" step="0.001" min="0" placeholder="Ejemplo: 0.740" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal" />
                  </label>
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">3. Apariencia de la gasolina
                    <span className="mt-2 block text-xs font-normal text-slate-600">Transparente y sin partículas puede ser compatible. Turbidez o partículas pueden indicar contaminación o agua. La apariencia por sí sola no certifica la calidad.</span>
                    <select name="apariencia" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal"><option>Transparente y sin partículas visibles</option><option>Ligera turbidez / duda visual</option><option>Turbia o con partículas visibles</option></select>
                  </label>
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">4. Presencia de agua
                    <span className="mt-2 block text-xs font-normal text-slate-600">Indique si mediante un método apropiado se detectó agua. Agua detectada requiere investigación; sin prueba no puede evaluarse.</span>
                    <select name="agua" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal"><option>No se detecta agua</option><option>Se detecta agua</option><option>No se realizó la prueba</option></select>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border-2 border-red-400 bg-red-50 p-4 sm:p-5">
                <h2 className="text-base font-bold leading-snug text-red-700 sm:text-lg">Datos que pueden indicar un problema</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">5. Sedimentos o partículas
                    <span className="mt-2 block text-xs font-normal text-slate-600">Compruebe si existen partículas o sedimentos visibles. Sin sedimentos es favorable; con sedimentos puede existir contaminación.</span>
                    <select name="sedimentos" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal"><option>No se observan sedimentos</option><option>Se observan sedimentos</option></select>
                  </label>
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold">6. Contenido de gomas
                    <span className="mt-2 block text-xs font-normal text-slate-600">Requiere análisis técnico. Dentro de especificación es compatible; fuera requiere investigación; sin análisis no puede determinarse.</span>
                    <select name="gomas" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal"><option>Dentro de especificación</option><option>No se realizó análisis</option><option>Fuera de especificación</option></select>
                  </label>
                  <label className="rounded-lg bg-white p-4 text-sm font-semibold sm:col-span-2">7. Resultado de laboratorio
                    <span className="mt-2 block text-xs font-normal text-slate-600">Si dispone de análisis, indique si cumple la especificación correspondiente. Sin análisis, la evaluación será únicamente preliminar.</span>
                    <select name="laboratorio" className="mt-3 w-full rounded-md border border-slate-300 p-2.5 font-normal"><option>Cumple especificaciones</option><option>No existe análisis de laboratorio</option><option>No cumple especificaciones</option></select>
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={isEvaluatingFuel} className="w-full bg-blue-700 py-6 text-base hover:bg-blue-800">{isEvaluatingFuel ? "Analizando muestra..." : "Analizar muestra"}</Button>
            </form>

            {fuelResult && <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 whitespace-pre-wrap" role="status"><strong>Resultado de Groq:</strong><p className="mt-2">{fuelResult}</p></div>}
            <div className="mt-5 rounded-lg bg-slate-100 p-4 text-xs text-slate-600"><strong>Importante:</strong> Esta herramienta es una evaluación preliminar y educativa. No sustituye análisis de laboratorio ni determina oficialmente el cumplimiento de una norma. No realice pruebas con fuego, llamas, chispas o calentamiento.</div>
          </section>
        </div>
      )}

      {/* Modal de voz de la IA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-hidden bg-black/70 px-3 py-16 backdrop-blur-sm sm:px-6 sm:py-20">
          {/* Botón cerrar */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-8 sm:top-8 sm:h-12 sm:w-12"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Contenedor principal */}
          <div className="flex h-full w-full flex-col items-center justify-center">
            {/* Esfera de IA con animaciones */}
            <div className="relative mb-20 h-[min(58vw,16rem)] w-[min(58vw,16rem)] sm:mb-24 sm:h-80 sm:w-80">
              <div
                className={`w-full h-full rounded-full transition-all duration-500 ${
                  isSpeaking ? "animate-pulse scale-110" : isListening ? "scale-105 animate-bounce" : "scale-100"
                }`}
                style={{
                  background: isSpeaking
                    ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(135,206,235,0.7), rgba(30,144,255,0.9), rgba(0,100,200,1))"
                    : isListening
                      ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,215,0,0.6), rgba(255,165,0,0.8), rgba(255,69,0,1))"
                      : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(135,206,235,0.6), rgba(30,144,255,0.8), rgba(0,100,200,1))",
                  boxShadow: isSpeaking
                    ? "0 0 80px rgba(30,144,255,0.8), inset 0 0 50px rgba(255,255,255,0.3)"
                    : isListening
                      ? "0 0 80px rgba(255,165,0,0.8), inset 0 0 50px rgba(255,255,255,0.3)"
                      : "0 20px 60px rgba(30,144,255,0.4), inset 0 0 50px rgba(255,255,255,0.2)",
                }}
              >
                {/* Brillo interno */}
                <div
                  className="absolute top-8 left-12 w-20 h-20 rounded-full opacity-50"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent)",
                  }}
                />

                {/* Ondas de sonido cuando habla */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping"
                      style={{ animationDelay: "1s" }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Controles de voz - Posicionados debajo de la esfera */}
            <div className="absolute bottom-5 z-20 flex gap-3 sm:bottom-16 sm:gap-4">
              {/* Botón de detener (rojo) */}
              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  className="h-14 w-14 rounded-full bg-red-600 shadow-lg transition-all duration-300 hover:bg-red-700 sm:h-16 sm:w-16"
                  size="icon"
                >
                  <Square className="h-8 w-8 text-white fill-white" />
                </Button>
              )}
              {/* Botón de micrófono */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`h-14 w-14 rounded-full transition-all duration-300 sm:h-16 sm:w-16 ${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-white/20 hover:bg-white/30"
                } ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                size="icon"
              >
                {isListening ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
