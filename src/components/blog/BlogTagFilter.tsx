import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const INITIAL_TAGS_TO_SHOW = 3;

export function BlogTagFilter({ tags, selectedTags, onTagToggle }: BlogTagFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  
  if (tags.length === 0) return null;

  const tagsToShow = showAllTags ? tags : tags.slice(0, INITIAL_TAGS_TO_SHOW);
  const hasMoreTags = tags.length > INITIAL_TAGS_TO_SHOW;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tagsToShow.map((tag) => {
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
      {hasMoreTags && !showAllTags && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(true)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Weitere
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      )}
      {showAllTags && hasMoreTags && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(false)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Weniger
          <ChevronDown className="w-4 h-4 ml-1 rotate-180" />
        </Button>
      )}
    </div>
  );
}

