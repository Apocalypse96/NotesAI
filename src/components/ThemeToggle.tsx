"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 px-0"
    >
      <span className="sr-only">Toggle theme</span>

      {/* Sun and moon with paper-like styling */}
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          // Moon with paper texture
          <div className="absolute inset-0 flex items-center justify-center">
            <Moon className="h-4 w-4 transition-all" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full"
            />
          </div>
        ) : (
          // Sun with paper texture
          <div className="absolute inset-0 flex items-center justify-center">
            <Sun className="h-4 w-4 transition-all" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-transparent rounded-full"
            />
          </div>
        )}
      </div>
    </Button>
  );
}
