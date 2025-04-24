"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxTags?: number;
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  className,
  disabled = false,
  maxTags = 10,
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]",
        {
          "cursor-not-allowed opacity-50": disabled,
          "cursor-text": !disabled,
        },
        className
      )}
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="gap-1 text-xs"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-full hover:bg-muted p-0.5"
            >
              <X size={12} />
              <span className="sr-only">Remove {tag} tag</span>
            </button>
          )}
        </Badge>
      ))}
      {!disabled && value.length < maxTags && (
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        />
      )}
      {value.length >= maxTags && (
        <span className="text-xs text-muted-foreground">
          Maximum of {maxTags} tags reached
        </span>
      )}
    </div>
  );
}
