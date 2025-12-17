import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ============================================================
// ASSISTANT PAGE
// KI-Assistent Chat-Interface
// 
// AI-INTEGRATION: Für OpenAI-Anbindung:
// 1. Edge Function erstellen für API-Calls
// 2. sendMessage-Funktion anpassen
// ============================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Dummy-Nachrichten für Demo
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hallo! Ich bin dein KI-Assistent bei Arvo Labs. Wie kann ich dir heute helfen?',
    timestamp: new Date(),
  },
];

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // AI-INTEGRATION: Hier Edge Function aufrufen
    // const response = await fetch('/api/chat', { ... });
    
    // Dummy-Antwort für Demo
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAssistantResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">KI-Assistent</h1>
          <p className="text-xs text-muted-foreground">Immer bereit zu helfen</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              message.role === 'assistant' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            
            <div className={cn(
              'max-w-[80%] p-3 rounded-2xl',
              message.role === 'assistant'
                ? 'bg-card border border-border rounded-tl-none'
                : 'bg-primary text-primary-foreground rounded-tr-none'
            )}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          size="icon"
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Dummy-Antworten für Demo
function getAssistantResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('workflow') || lowerInput.includes('automatisierung')) {
    return 'Du hast aktuell 3 aktive Workflows. Der beliebteste ist "E-Mail zu Task" mit 156 Ausführungen diese Woche. Möchtest du einen neuen Workflow erstellen?';
  }
  
  if (lowerInput.includes('task') || lowerInput.includes('aufgabe')) {
    return 'Du hast 5 offene Aufgaben für heute. Die wichtigste ist "Q4 Report finalisieren" mit Deadline um 17:00 Uhr. Soll ich dir dabei helfen?';
  }
  
  if (lowerInput.includes('dokument')) {
    return 'In deiner Dokumentenbibliothek befinden sich 42 Dokumente. Die 3 zuletzt bearbeiteten sind: Q4 Report, Projektplan 2024, und Meeting Notes. Welches soll ich öffnen?';
  }
  
  return 'Das ist eine gute Frage! Ich bin noch im Training, aber ich kann dir bei Workflows, Aufgaben und Dokumenten helfen. Was möchtest du wissen?';
}

export default AssistantPage;
