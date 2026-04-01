import { ChatUI } from "@/components/chat/chat-ui"

export default function ChatPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">AI Financial Assistant</h1>
                <p className="text-white/40 text-sm mt-0.5">Ask questions about your spending, savings, and financial health.</p>
            </div>

            <ChatUI />
        </div>
    )
}
