import { Search, Book, MessageCircle, Video, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const helpTopics = [
  { icon: Book, title: "Getting Started", description: "Learn the basics of Arvo Labs", articles: 12 },
  { icon: Video, title: "Video Tutorials", description: "Step-by-step video guides", articles: 8 },
  { icon: FileText, title: "Documentation", description: "In-depth technical docs", articles: 45 },
  { icon: MessageCircle, title: "FAQs", description: "Frequently asked questions", articles: 23 },
];

const popularArticles = [
  "How to create your first workflow",
  "Setting up triggers and schedules",
  "Connecting integrations",
  "Understanding analytics dashboard",
  "Managing team permissions",
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Suche",
        description: `Suche nach: ${searchQuery}`,
      });
    }
  };

  const handleTopicClick = (title: string) => {
    toast({
      title: title,
      description: "Öffne Artikel...",
    });
  };

  const handleArticleClick = (article: string) => {
    toast({
      title: "Artikel öffnen",
      description: article,
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support kontaktieren",
      description: "Öffne Support-Chat...",
    });
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo planen",
      description: "Öffne Demo-Buchung...",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">How can we help you?</h1>
        <p className="text-muted-foreground">Search our knowledge base or browse topics below</p>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for help..." 
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card 
              key={topic.title} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleTopicClick(topic.title)}
            >
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{topic.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                <span className="text-xs text-primary">{topic.articles} articles</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Popular Articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularArticles.map((article, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-between h-auto py-3 px-4"
                onClick={() => handleArticleClick(article)}
              >
                <span className="text-sm text-left">{article}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need more help?</CardTitle>
            <CardDescription>Our support team is here for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-purple-500"
              onClick={handleContactSupport}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleScheduleDemo}
            >
              <Video className="h-4 w-4 mr-2" />
              Schedule a Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
