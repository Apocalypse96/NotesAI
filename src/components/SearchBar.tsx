"use client";

import * as React from "react";
import { Search, X, Tag, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterByTag?: (tag: string) => void;
  onSortChange?: (sort: "newest" | "oldest" | "title") => void;
  className?: string;
  availableTags?: string[];
}

export function SearchBar({
  onSearch,
  onFilterByTag,
  onSortChange,
  className,
  availableTags = [],
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [activeSort, setActiveSort] = React.useState<
    "newest" | "oldest" | "title"
  >("newest");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleTagSelect = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
      onFilterByTag && onFilterByTag("");
    } else {
      setActiveTag(tag);
      onFilterByTag && onFilterByTag(tag);
    }
  };

  const handleSortSelect = (sort: "newest" | "oldest" | "title") => {
    setActiveSort(sort);
    onSortChange && onSortChange(sort);
  };

  return (
    <div
      className={cn(
        "flex gap-2 items-center p-2 bg-white dark:bg-gray-900 rounded-lg",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 border-none focus-visible:ring-1 focus-visible:ring-primary/30 bg-transparent"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 opacity-70 hover:opacity-100"
            onClick={handleClear}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {availableTags.length > 0 && onFilterByTag && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeTag ? "secondary" : "outline"}
              size="sm"
              className={cn("gap-1.5 whitespace-nowrap border-none", {
                "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":
                  activeTag,
              })}
            >
              <Tag className="h-3.5 w-3.5" />
              {activeTag || "Filter Tags"}
              {activeTag && <X className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {activeTag && (
              <>
                <DropdownMenuItem onClick={() => handleTagSelect(activeTag)}>
                  Clear filter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {availableTags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className="flex justify-between items-center"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                  {tag}
                </span>
                {tag === activeTag && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {onSortChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 whitespace-nowrap border-none"
            >
              <Calendar className="h-3.5 w-3.5" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleSortSelect("newest")}
              className="flex justify-between"
            >
              Newest first
              {activeSort === "newest" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortSelect("oldest")}
              className="flex justify-between"
            >
              Oldest first
              {activeSort === "oldest" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortSelect("title")}
              className="flex justify-between"
            >
              By title
              {activeSort === "title" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
