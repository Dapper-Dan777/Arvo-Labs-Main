import { Button, ButtonProps } from "@/components/ui/button";
import { useSectionGradient } from "@/lib/sectionGradients";
import { cn } from "@/lib/utils";

/**
 * Section-Button: Primary-Button mit Section-spezifischem Gradient
 * 
 * Nutzt automatisch den passenden Gradient für die aktuelle Route.
 * Text ist immer weiß für bessere Lesbarkeit auf Gradients.
 */
export function SectionButton({ 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const sectionGradient = useSectionGradient();
  
  return (
    <Button
      className={cn("text-white font-medium", className)}
      style={{ background: sectionGradient }}
      {...props}
    >
      {children}
    </Button>
  );
}

