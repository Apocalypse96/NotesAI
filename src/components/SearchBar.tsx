"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, SortAsc, Tag } from "lucide-react";

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
  availableTags = [],
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={`flex items-center gap-2 p-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {availableTags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Tag className="mr-1 h-4 w-4" />
              Tags
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableTags.map((tag) => (
              <DropdownMenuItem key={tag} onClick={() => onFilterByTag(tag)}>
                {tag}
              </DropdownMenuItem>
            ))}
            {availableTags.length > 0 && (
              <DropdownMenuItem onClick={() => onFilterByTag("")}>
                Clear filter
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SortAsc className="mr-1 h-4 w-4" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            checked={true}
            onClick={() => onSortChange("newest")}
          >
            Newest first
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={false}
            onClick={() => onSortChange("oldest")}
          >
            Oldest first
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={false}
            onClick={() => onSortChange("title")}
          >
            By title
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
