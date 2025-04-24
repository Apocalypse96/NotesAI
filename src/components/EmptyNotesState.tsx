import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { enhancedAnimations } from "@/styles/enhanced-theme";

interface EmptyNotesStateProps {
  message?: string;
  className?: string;
}

export function EmptyNotesState({
  message = "No notes found",
  className,
}: EmptyNotesStateProps) {
  return (
    <motion.div
      className={`col-span-full p-12 text-center flex flex-col items-center justify-center ${className}`}
      variants={enhancedAnimations.noteAppear}
    >
      <div className="relative mb-8">
        {/* Stack of paper effect */}
        <div className="absolute -bottom-2 -right-2 h-32 w-32 bg-gray-100 dark:bg-gray-800 rounded-md rotate-6"></div>
        <div className="absolute -bottom-1 -right-1 h-32 w-32 bg-gray-50 dark:bg-gray-700 rounded-md rotate-3"></div>
        <div className="relative h-32 w-32 bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-amber-100 dark:bg-amber-900/30 rounded-sm transform rotate-2"></div>
      </div>

      <h3 className="text-xl font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground max-w-sm">
        Create your first note using the form above to get started with your
        collection.
      </p>
    </motion.div>
  );
}
