"use client"
import { Button } from "../components/ui/button"
import { Trash2 } from "lucide-react"

const HistoryPanel = ({ sessions, onLoadSession, onDeleteSession, currentSessionId }) => {
  // Sort sessions by timestamp (newest first)
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  if (sortedSessions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>No chat history yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-700">
      {sortedSessions.map((session) => (
        <div
          key={session.id}
          className={`p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-start ${
            session.id === currentSessionId ? "bg-gray-700" : ""
          }`}
        >
          <div className="flex-1 pr-2" onClick={() => onLoadSession(session)}>
            <p className="text-sm font-medium truncate text-gray-200">{session.preview}</p>
            <p className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleString()}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteSession(session.id)
            }}
            className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default HistoryPanel
