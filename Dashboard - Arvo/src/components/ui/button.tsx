import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Glass Button Variants - Apple Liquid Glass Stil
 * 
 * Primary: Gradient-Hintergrund mit Glass-Effekt und subtiler Border
 * Secondary: Transparente Glasfläche mit Border
 * Ghost: Transparente Glasfläche ohne Border (für dezente Actions)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default: "glass-button-primary text-primary-foreground",
        destructive: "bg-destructive/90 backdrop-filter backdrop-blur-[10px] -webkit-backdrop-filter border border-destructive/50 text-destructive-foreground hover:bg-destructive hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-destructive focus-visible:outline-offset-2",
        outline: "glass-button-secondary text-foreground",
        secondary: "glass-button-secondary text-secondary-foreground",
        ghost: "hover:bg-[rgba(255,255,255,0.08)] hover:backdrop-filter hover:backdrop-blur-[8px] hover:-webkit-backdrop-filter text-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-[rgba(255,255,255,0.12)]",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
