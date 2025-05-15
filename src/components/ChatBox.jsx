import { Loader2 } from "lucide-react"

const ChatBox = ({ messages, loading }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <p className="text-center mb-2">No messages yet</p>
        <p className="text-center text-sm">Start a conversation by typing a message below</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-700 text-gray-100">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBox
