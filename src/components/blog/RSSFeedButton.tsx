import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Rss, ChevronDown, ExternalLink, QrCode } from "lucide-react";
import { AppleIcon } from "./AppleIcon";
import { GoogleIcon } from "./GoogleIcon";

export function RSSFeedButton() {
  const baseUrl = typeof window !== "undefined" 
    ? `${window.location.protocol}//${window.location.host}`
    : "https://arvo-labs.de";
  
  const rssUrl = `${baseUrl}/rss.xml`;

  // RSS-Reader URLs
  const rssReaders = [
    {
      name: "Feedly",
      url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`,
    },
    {
      name: "Inoreader",
      url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(rssUrl)}`,
    },
    {
      name: "The Old Reader",
      url: `https://theoldreader.com/feeds/subscribe?url=${encodeURIComponent(rssUrl)}`,
    },
    {
      name: "NewsBlur",
      url: `https://www.newsblur.com/?url=${encodeURIComponent(rssUrl)}`,
    },
  ];

  // Weitere Optionen
  const additionalOptions = [
    {
      name: "In Apple News öffnen",
      url: `https://www.icloud.com/shortcuts/?url=${encodeURIComponent(rssUrl)}`,
      icon: <AppleIcon className="w-4 h-4" />,
      description: "Für iOS-Nutzer",
    },
    {
      name: "In Google News öffnen",
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(rssUrl)}`,
      icon: <GoogleIcon className="w-4 h-4" />,
      description: "Google News Integration",
    },
    {
      name: "QR-Code anzeigen",
      url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rssUrl)}`,
      icon: <QrCode className="w-4 h-4" />,
      description: "Für Mobile-Geräte",
      isQR: true,
    },
  ];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(rssUrl);
    // Optional: Toast-Benachrichtigung anzeigen
    alert("RSS-URL wurde in die Zwischenablage kopiert!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="opuxOutline" size="sm" className="text-sm">
          <Rss className="w-4 h-4 mr-2" />
          RSS-Feed abonnieren
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={handleCopyUrl} className="cursor-pointer">
          <Rss className="w-4 h-4 mr-2" />
          RSS-URL kopieren
        </DropdownMenuItem>
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border mt-1">
          In Reader öffnen:
        </div>
        {rssReaders.map((reader) => (
          <DropdownMenuItem key={reader.name} asChild>
            <a
              href={reader.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              {reader.name}
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border mt-1">
          Weitere Optionen:
        </div>
        {additionalOptions.map((option) => (
          <DropdownMenuItem key={option.name} asChild>
            <a
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start"
              title={option.description}
            >
              <div className="flex items-center w-full">
                <div className="mr-2 flex items-center justify-center w-4 h-4">
                  {option.icon}
                </div>
                <span className="flex-1">{option.name}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
              {option.description && (
                <span className="text-xs text-muted-foreground ml-6 mt-0.5">
                  {option.description}
                </span>
              )}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

