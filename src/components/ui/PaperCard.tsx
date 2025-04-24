import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { notesAnimations } from "@/styles/notes-theme";
import {
  paperTextures,
  paperColors,
  cornerFoldSVG,
} from "@/styles/paper-textures";
import { paperClipSVG } from "@/styles/enhanced-theme";

interface PaperCardProps {
  children: ReactNode;
  className?: string;
  variant?: "lined" | "grid" | "dots" | "aged";
  hasFold?: boolean;
  hasRipple?: boolean;
  hasClip?: boolean; // New: optional paper clip decoration
  color?: "default" | "cream" | "yellow" | "blue" | "pink" | "green"; // New: color options
  index?: number;
  onClick?: () => void;
}

export function PaperCard({
  children,
  className,
  variant = "lined",
  hasFold = true,
  hasRipple = false,
  hasClip = false,
  color = "default",
  index = 0,
  onClick,
}: PaperCardProps) {
  const style = {
    backgroundImage: paperTextures[variant],
    backgroundSize: variant === "aged" ? "cover" : "auto",
    backgroundColor: paperColors[color] || paperColors.default,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-md border border-gray-200 dark:border-gray-800 p-4 overflow-hidden group",
        onClick ? "cursor-pointer" : "",
        className
      )}
      style={style}
      initial="initial"
      animate="animate"
      whileHover={onClick ? "hover" : undefined}
      variants={notesAnimations.card}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
    >
      {children}

      {/* Paper corner fold effect */}
      {hasFold && (
        <div
          className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: cornerFoldSVG }}
        />
      )}

      {/* Paper clip effect */}
      {hasClip && (
        <div
          className="absolute -top-2 left-8 w-8 h-12 pointer-events-none rotate-12 opacity-70"
          dangerouslySetInnerHTML={{ __html: paperClipSVG }}
        />
      )}

      {/* Ripple effect for hover */}
      {hasRipple && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );
}

interface PaperHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  tags?: string[];
  date?: string;
  className?: string;
}

export function PaperHeader({
  title,
  description,
  tags,
  date,
  className,
}: PaperHeaderProps) {
  return (
    <div className={cn("mb-4 space-y-1.5", className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium leading-tight">{title}</h3>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {(tags || date) && (
        <div className="flex flex-wrap gap-2 items-center pt-1">
          {date && (
            <span className="text-xs text-muted-foreground inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-3 h-3 mr-1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {date}
            </span>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                            rounded-full px-2 py-0.5 text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-3 h-3 mr-0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
