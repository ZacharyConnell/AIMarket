import ChatInterface from "@/components/ChatInterface";

export default function ChatTest() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-8">AI Assistant</h1>
      <p className="text-muted-foreground mb-8">
        Ask me anything about our AI marketplace platform. I can help you understand how
        things work, guide you through processes, or answer technical questions about
        AI products.
      </p>
      <ChatInterface />
    </div>
  );
}