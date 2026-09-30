"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, Mic, MicOff, Square } from "lucide-react"
import type SpeechRecognition from "speech-recognition"
import { numberToWordsEs } from "@/utils/number-to-words"

export default function VoiceAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasGreetedThisSession, setHasGreetedThisSession] = useState(false)
  const [hasSpokenCurrentGreeting, setHasSpokenCurrentGreeting] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true // Escucha continuamente
        recognitionRef.current.interimResults = false // Solo resultados finales para procesar

        recognitionRef.current.lang = "es-ES"

        recognitionRef.current.onresult = (event) => {
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

        recognitionRef.current.onerror = (event) => {
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

        processedResponse = processedResponse.replace(priceRegex, (match, p1) => {
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
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Modal de voz de la IA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* Botón cerrar */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute top-8 right-8 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Contenedor principal */}
          <div className="flex flex-col items-center justify-center h-full w-full">
            {/* Esfera de IA con animaciones */}
            <div className="relative w-64 h-64 mb-16">
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
            <div className="absolute bottom-16 flex gap-4 z-20">
              {/* Botón de detener (rojo) */}
              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg transition-all duration-300"
                  size="icon"
                >
                  <Square className="h-8 w-8 text-white fill-white" />
                </Button>
              )}
              {/* Botón de micrófono */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`h-16 w-16 rounded-full transition-all duration-300 ${
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
