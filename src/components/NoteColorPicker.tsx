"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { paperColors } from "@/styles/paper-textures";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type NoteColor = "default" | "cream" | "yellow" | "blue" | "pink" | "green";

interface NoteColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  className?: string;
}

export function NoteColorPicker({
  value,
  onChange,
  className,
}: NoteColorPickerProps) {
  const colors: { value: NoteColor; label: string }[] = [
    { value: "default", label: "White" },
    { value: "cream", label: "Cream" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "pink", label: "Pink" },
    { value: "green", label: "Green" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1.5 h-8 px-2 border-dashed", className)}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: paperColors[value] || paperColors.default,
            }}
          />
          <Palette className="h-3.5 w-3.5" />
          <span className="sr-only">Select note color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="grid grid-cols-3 gap-1 p-1">
          {colors.map((color) => (
            <div
              key={color.value}
              className={cn(
                "h-8 w-8 rounded cursor-pointer hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700",
                value === color.value && "ring-2 ring-primary ring-offset-1"
              )}
              style={{
                backgroundColor:
                  paperColors[color.value] || paperColors.default,
              }}
              onClick={() => onChange(color.value)}
              title={color.label}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
