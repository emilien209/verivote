import { ChatInterface } from './chat-interface';
import { Card } from '@/components/ui/card';

export default function FaqPage() {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Chatbot</h1>
        <p className="text-muted-foreground">
          Your personal assistant for election-related questions.
        </p>
      </div>
      <Card className="flex-1">
        <ChatInterface />
      </Card>
    </div>
  );
}
