import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function BlogSearch({ searchQuery, onSearchChange, onClear }: BlogSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Artikel durchsuchen..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

