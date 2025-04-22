"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Loader } from "lucide-react"
import { getChatCompletion } from "@/lib/openai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Como posso ajudar você hoje?",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepara mensagens para a API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Chama a API
      const responseContent = await getChatCompletion(apiMessages)
      
      // Adiciona resposta do assistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent || "Desculpe, não consegui processar sua solicitação.",
        role: "assistant",
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Adiciona mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Desculpe, ocorreu um erro ao processar sua solicitação.",
        role: "assistant",
      }
      
      setMessages((prev) => [...prev, errorMessage])
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="max-w-lg w-full h-[80vh] flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2 px-4 py-3 border-b">
        <Bot className="h-5 w-5" />
        <h2 className="font-semibold">Chat IA</h2>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === "user"
                  ? "bg-blue-500/10 text-blue-900 border border-blue-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-10 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="shrink-0"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
