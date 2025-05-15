"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatBox from "../components/ChatBox"
import InputSection from "../components/InputSection"
import HistoryPanel from "../components/HistoryPanel"
import { Button } from "../components/ui/button"
import { Trash2, History, X } from "lucide-react"

export default function Home() {
  const uri=process.env.REACT_APP_BACKEND_URL
  console.log(uri)
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(uuidv4())
  const [showHistory, setShowHistory] = useState(false)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions")
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  // Save current session to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const updatedSessions = [...sessions]
      const existingSessionIndex = updatedSessions.findIndex((session) => session.id === sessionId)

      const sessionData = {
        id: sessionId,
        messages: messages,
        timestamp: new Date().toISOString(),
        preview: messages[messages.length - 1].content.substring(0, 30) + "...",
      }

      if (existingSessionIndex !== -1) {
        updatedSessions[existingSessionIndex] = sessionData
      } else {
        updatedSessions.push(sessionData)
      }

      setSessions(updatedSessions)
      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions))
    }
  }, [messages, sessionId])

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message) => {
    if (!message.trim()) return
  
    // Add user message
    const userMessage = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
  
    try {
      const res = await fetch(`${uri}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
        }),
      })
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.error || "Something went wrong")
  
      const botMessage = { role: "bot", content: data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error fetching response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }
  

  const handleClearSession = () => {
    setMessages([])
    setSessionId(uuidv4())
  }

  const handleDeleteSession = async (id) => {
    // Remove from localStorage
    if (id === sessionId) {
      handleClearSession()
    }
    const updatedSessions = sessions.filter((session) => session.id !== id)
    setSessions(updatedSessions)
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions))
  
    // Delete from backend
    try {
      await fetch(`${uri}/api/chat/clear/${id}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.error("Failed to delete session from backend:", err)
    }
  
    // If current session was deleted, start new one
    
  }
  

  const handleLoadSession = async (session) => {
    setSessionId(session.id)
    setShowHistory(false)
  
    try {
      const res = await fetch(`${uri}/api/chat/history/${session.id}`)
      const data = await res.json()
      setMessages(data.history || [])
    } catch (err) {
      console.error("Failed to load session history:", err)
      setMessages([])
    }
  }
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-900">
      <div className="w-full max-w-4xl h-[90vh] bg-gray-800 rounded-lg shadow-lg flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-lg">
          <h1 className="text-xl font-bold text-gray-100">RAG Chatbot</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              className="relative border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <History className="h-5 w-5" />
              {sessions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {sessions.length}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearSession}
              title="Clear current session"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Clear
            </Button>
            
          </div>
        </div>

        {/* Chat Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-900">
          <ChatBox messages={messages} loading={loading} />
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
          <InputSection onSendMessage={handleSendMessage} loading={loading} />
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="absolute top-16 right-0 w-80 h-[calc(100%-4rem)] bg-gray-800 border-l border-gray-700 shadow-lg z-10 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-semibold text-gray-100">Chat History</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <HistoryPanel
                sessions={sessions}
                onLoadSession={handleLoadSession}
                onDeleteSession={handleDeleteSession}
                currentSessionId={sessionId}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
