import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants, type ToggleVariants } from "@/components/ui/toggle";

type ToggleGroupVariantProps = {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
};

const ToggleGroupContext = React.createContext<ToggleGroupVariantProps>({
  size: "default",
  variant: "default",
});

type ToggleGroupProps = Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type"> & 
  ToggleGroupVariantProps & {
    type?: "single" | "multiple";
  };

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, type = "single", ...props }, ref) => {
  const rootProps = {
    ...props,
    type: type as "single" | "multiple",
  } as React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
  
  return (
    <ToggleGroupPrimitive.Root ref={ref} {...rootProps} className={cn("flex items-center justify-center gap-1", className)}>
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & 
  ToggleGroupVariantProps & {
    value: string;
  };

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
