import { ChatInterface } from '@/components/ChatInterface'
import { ACTIVE_TOPIC } from '@/topic.config'

export default function ChatPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-gray-400 mt-2">
          Powered by Claude — trained on transcripts from every {ACTIVE_TOPIC.name} tutorial in our library.
          Creators still get their views when you watch on YouTube.
        </p>
      </div>
      <ChatInterface topicName={ACTIVE_TOPIC.name} />
    </div>
  )
}
