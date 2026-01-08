import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRipple } from "@/hooks/use-ripple";
import { cn } from "@/lib/utils";

export function RippleButton({ className, children, ...props }: ButtonProps) {
  const { ripples, addRipple } = useRipple();

  return (
    <Button
      {...props}
      className={cn("relative overflow-hidden", className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </Button>
  );
}

