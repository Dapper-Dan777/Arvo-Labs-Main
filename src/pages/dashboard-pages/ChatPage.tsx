import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// ============================================================
// CHAT PAGE
// OpenAI-ähnliches Chat-Interface
// ============================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hallo! Wie kann ich dir heute helfen?',
    timestamp: new Date(),
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getChatResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] pb-20 lg:pb-0">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4 max-w-3xl mx-auto',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            {/* Avatar */}
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
            
            {/* Message Content */}
            <div className={cn(
              'flex-1 space-y-2',
              message.role === 'user' && 'text-right'
            )}>
              <div className={cn(
                'inline-block p-4 rounded-2xl max-w-[85%]',
                message.role === 'assistant'
                  ? 'bg-card border border-border text-foreground'
                  : 'bg-primary text-primary-foreground'
              )}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
              <p className="text-xs text-muted-foreground px-1">
                {message.timestamp.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="inline-block p-4 rounded-2xl bg-card border border-border">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area - OpenAI Style */}
      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto p-4">
          <div className="relative">
            <div className="flex items-end gap-2 p-3 rounded-2xl border border-border bg-card focus-within:border-primary/50 transition-colors">
              <div className="flex gap-1 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toast({ title: 'Neuer Chat', description: 'Neuer Chat wird erstellt...' })}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toast({ title: 'Anhang', description: 'Datei anhängen...' })}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toast({ title: 'Bild', description: 'Bild anhängen...' })}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nachricht schreiben... (Enter zum Senden, Shift+Enter für neue Zeile)"
                className="min-h-[60px] max-h-[200px] resize-none border-0 focus-visible:ring-0 bg-transparent"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute bottom-3 right-3 h-8 w-8 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Chat kann Fehler machen. Überprüfe wichtige Informationen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy responses
function getChatResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hallo') || lowerInput.includes('hi')) {
    return 'Hallo! Wie kann ich dir helfen?';
  }
  
  if (lowerInput.includes('hilfe') || lowerInput.includes('help')) {
    return 'Ich kann dir bei verschiedenen Aufgaben helfen:\n\n• Fragen beantworten\n• Informationen suchen\n• Texte zusammenfassen\n• Code erklären\n\nWas möchtest du wissen?';
  }
  
  if (lowerInput.includes('danke') || lowerInput.includes('thanks')) {
    return 'Gerne geschehen! Gibt es noch etwas, womit ich dir helfen kann?';
  }
  
  return 'Das ist eine interessante Frage. Lass mich darüber nachdenken...\n\nBasierend auf deiner Anfrage kann ich dir folgendes sagen: Dies ist eine Demo-Antwort. In einer echten Implementierung würde hier eine KI-API (z.B. OpenAI) aufgerufen werden, um eine intelligente Antwort zu generieren.';
}

export default ChatPage;





