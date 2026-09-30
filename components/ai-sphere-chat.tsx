"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, X, Send } from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function AISphereChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simular que la IA está "pensando" antes de saludar
      setIsTyping(true)
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: "welcome",
          content:
            "¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta sobre nuestro sitio web, productos, servicios o políticas. ¿En qué puedo ayudarte hoy?",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
        setIsTyping(false)
      }, 2000)
    }
  }, [isOpen, messages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Simular respuesta de IA
      setTimeout(() => {
        const responses = [
          "Gracias por tu pregunta. Basándome en la información de nuestro sitio web, puedo ayudarte con eso.",
          "Excelente consulta. Déjame buscar esa información en nuestra base de conocimientos.",
          "Entiendo tu necesidad. Te puedo proporcionar información detallada sobre ese tema.",
          "Perfecto, esa es una pregunta muy común. Te explico todo lo que necesitas saber.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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

      {/* Modal de la IA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Botón cerrar */}
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Contenedor principal */}
          <div className="relative z-10 flex flex-col items-center max-w-2xl w-full mx-4">
            {/* Esfera de IA */}
            <div className="relative mb-8">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-b from-cyan-200 via-blue-400 to-blue-600 shadow-2xl transition-all duration-500 ${
                  isTyping ? "animate-pulse scale-105" : "scale-100"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(135,206,235,0.6), rgba(30,144,255,0.8), rgba(0,100,200,1))",
                  boxShadow: "0 20px 60px rgba(30,144,255,0.4), inset 0 0 50px rgba(255,255,255,0.2)",
                }}
              >
                {/* Brillo interno */}
                <div
                  className="absolute top-6 left-8 w-16 h-16 rounded-full opacity-40"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.8), transparent)",
                  }}
                />
              </div>

              {/* Indicador de que está "hablando" */}
              {isTyping && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Área de conversación */}
            <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              {/* Mensajes */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        message.isUser
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="rounded-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
