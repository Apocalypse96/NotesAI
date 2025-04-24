import * as React from "react";
import { Button } from "./button";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
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
