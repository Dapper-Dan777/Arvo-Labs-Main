import React from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function BlogTagFilter({ tags, selectedTags, onTagToggle }: BlogTagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Button
            key={tag}
            variant={isSelected ? "opux" : "opuxOutline"}
            size="sm"
            onClick={() => onTagToggle(tag)}
            className={cn(
              "text-sm",
              isSelected && "bg-primary text-primary-foreground"
            )}
          >
            <Tag className="w-3 h-3 mr-1.5" />
            {tag}
          </Button>
        );
      })}
    </div>
  );
}

