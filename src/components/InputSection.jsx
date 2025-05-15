"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Send } from "lucide-react"

const InputSection = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !loading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading || !message.trim()}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}

export default InputSection
