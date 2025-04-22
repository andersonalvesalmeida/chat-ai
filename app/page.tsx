import { ChatAI } from "@/components/chat-ai";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <ChatAI />
      <div>Funcionalidades do modo Dark</div>
    </main>
  );
}
