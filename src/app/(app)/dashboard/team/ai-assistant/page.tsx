"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Lightbulb, Zap, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";

const suggestedPrompts = [
  { icon: Lightbulb, text: "Workflow-Verbesserungen vorschlagen", description: "KI-gestützte Empfehlungen erhalten" },
  { icon: Zap, text: "Neue Automatisierung erstellen", description: "Workflows automatisch aufbauen" },
  { icon: Clock, text: "Trigger-Performance analysieren", description: "Automatisierungs-Metriken überprüfen" },
];

const initialMessages: Array<{ role: "user" | "assistant"; content: string; isTyping?: boolean }> = [
  {
    role: "assistant",
    content: "Hallo! Ich bin dein KI-Assistent für Arvo Labs. Ich kann dir helfen, Workflows zu erstellen, die Performance zu analysieren und Automatisierungen zu optimieren. Wie kann ich dir heute helfen?",
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function AnimatedText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 15);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
}

export default function TeamAIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMessage = input.trim();
    setInput("");
    setIsGenerating(true);

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages([...newMessages, { role: "assistant" as const, content: aiResponse, isTyping: true }]);
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 ? { ...msg, isTyping: false } : msg
          )
        );
        setIsGenerating(false);
      }, aiResponse.length * 15);
    }, 500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("workflow") || lowerInput.includes("automatisierung")) {
      return "Ich kann dir dabei helfen, Workflows zu erstellen und zu optimieren. Basierend auf deinen Anforderungen kann ich verschiedene Automatisierungsstrategien vorschlagen. Welchen spezifischen Use-Case möchtest du automatisieren?";
    }
    
    if (lowerInput.includes("performance") || lowerInput.includes("analyse")) {
      return "Für Performance-Analysen schaue ich mir deine aktuellen Workflows an. Ich kann dir zeigen, welche Automatisierungen am effizientesten laufen und wo es Optimierungspotenzial gibt. Soll ich eine detaillierte Analyse durchführen?";
    }
    
    if (lowerInput.includes("integrier") || lowerInput.includes("verbinden")) {
      return "Integrationen sind ein wichtiger Teil deiner Automatisierungen. Ich kann dir helfen, verschiedene Services zu verbinden und die richtigen APIs zu konfigurieren. Welche Integration möchtest du einrichten?";
    }
    
    return `Ich verstehe, dass du "${userInput}" möchtest. Lass mich das für dich analysieren und die beste Lösung finden. Kannst du mir mehr Details zu deinem spezifischen Anwendungsfall geben?`;
  };

  const handleSuggestedPrompt = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      textarea?.focus();
    }, 0);
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Bot}
        title="AI Assistant"
        description="Intelligente Unterstützung für deine Workflows"
      />
      
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">

        {/* Chat Area */}
      <ScrollArea className="flex-1 relative" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Welcome State */}
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-foreground">
                  Wie kann ich dir helfen?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Stelle Fragen zu Workflows, Automatisierungen und Optimierungen
                </p>
              </div>
              
              {/* Suggested Prompts */}
              <div className="space-y-3">
                {suggestedPrompts.map((prompt, i) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSuggestedPrompt(prompt.text)}
                      className={cn(
                        "group w-full p-4 rounded-lg border bg-card hover:bg-accent/50",
                        "hover:border-primary/50 transition-all duration-200 text-left",
                        "animate-slide-up hover:shadow-sm"
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-0.5">{prompt.text}</h3>
                          <p className="text-xs text-muted-foreground">{prompt.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 1 && (
            <div className="space-y-8 pt-6">
              {messages.slice(1).map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 max-w-[80%]",
                      "transition-all duration-200",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card border shadow-sm"
                    )}
                  >
                    {message.role === "assistant" && message.isTyping ? (
                      <TypingIndicator />
                    ) : message.role === "assistant" && i === messages.slice(1).length - 1 && !message.isTyping ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <AnimatedText text={message.content} />
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground m-0">{message.content}</p>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
            </div>
          </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t bg-card/50 backdrop-blur-sm shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Frage stellen..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className={cn(
                  "min-h-[52px] max-h-[180px] resize-none",
                  "text-sm placeholder:text-muted-foreground",
                  "pr-12"
                )}
                rows={1}
              />
              <div className="absolute right-3 bottom-3">
                <Button
                  onClick={handleSend} 
                  disabled={!input.trim() || isGenerating}
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0",
                    "disabled:opacity-40"
                  )}
                >
                  {isGenerating ? (
                    <div className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            KI kann Fehler machen. Überprüfe wichtige Informationen.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

