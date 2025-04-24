"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
interface ButtonProps {
  className?: string | undefined;
  disabled?: boolean;
  variant?: string;
  size?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  [key: string]: any; // Use any to avoid type conflicts with ReactNode
}

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      children,
      isLoading,
      loadingText,
      disabled,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        className={cn(className)}
        disabled={isLoading || disabled}
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
