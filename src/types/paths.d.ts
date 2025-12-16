// Type definitions for path aliases
// This file helps TypeScript resolve the @/* path aliases

declare module "@/lib/utils" {
  import { type ClassValue } from "clsx";
  export function cn(...inputs: ClassValue[]): string;
}

declare module "@/components/ui/button" {
  import * as React from "react";
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    size?: string;
    asChild?: boolean;
  }
  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
  export const buttonVariants: any;
}

declare module "@/components/ui/toast" {
  import * as React from "react";
  export const Toast: React.ComponentType<any>;
  export const ToastClose: React.ComponentType<any>;
  export const ToastDescription: React.ComponentType<any>;
  export const ToastProvider: React.ComponentType<any>;
  export const ToastTitle: React.ComponentType<any>;
  export const ToastViewport: React.ComponentType<any>;
  export type ToastProps = any;
  export type ToastActionElement = any;
}

declare module "@/components/ui/toaster" {
  import * as React from "react";
  export const Toaster: React.ComponentType<any>;
}

declare module "@/components/ui/sonner" {
  import * as React from "react";
  export const Toaster: React.ComponentType<any>;
  export const toast: any;
}

declare module "@/components/ui/tooltip" {
  import * as React from "react";
  export const TooltipProvider: React.ComponentType<any>;
}

declare module "@/components/ui/toggle" {
  import { type VariantProps } from "class-variance-authority";
  export const toggleVariants: (props?: { variant?: "default" | "outline"; size?: "default" | "sm" | "lg" }) => string;
  export const Toggle: any;
  export type ToggleVariants = VariantProps<typeof toggleVariants>;
}

declare module "@/contexts/ThemeContext" {
  import * as React from "react";
  export const ThemeProvider: React.ComponentType<{ children: React.ReactNode }>;
  export function useTheme(): { theme: string; setTheme: (theme: string) => void; toggleTheme: () => void };
}

declare module "@/contexts/LanguageContext" {
  import * as React from "react";
  export const LanguageProvider: React.ComponentType<{ children: React.ReactNode }>;
  export function useLanguage(): { language: string; setLanguage: (lang: string) => void; t: any };
}

declare module "@/hooks/use-toast" {
  import * as React from "react";
  export function useToast(): { toast: any; dismiss: (id?: string) => void; toasts: any[] };
  export const toast: any;
}

declare module "@/hooks/use-mobile" {
  export function useIsMobile(): boolean;
}

declare module "@/i18n/translations" {
  export const translations: any;
  export type Language = "de" | "en";
}

declare module "@/components/layout/Layout" {
  import * as React from "react";
  export const Layout: React.ComponentType<{ children: React.ReactNode }>;
}

declare module "@/components/BackgroundAnimation" {
  import * as React from "react";
  export const BackgroundAnimation: React.ComponentType;
}

declare module "@/components/ScrollToTop" {
  import * as React from "react";
  export const ScrollToTop: React.ComponentType;
}

declare module "@/components/pricing/BillingToggle" {
  import * as React from "react";
  export interface BillingToggleProps {
    isYearly: boolean;
    onToggle: (isYearly: boolean) => void;
    monthlyLabel: string;
    yearlyLabel: string;
    discountLabel: string;
  }
  export const BillingToggle: React.ComponentType<BillingToggleProps>;
}

declare module "@/components/pricing/PricingCard" {
  import * as React from "react";
  export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: string;
    priceYearly: string;
    period: string;
    users: string;
    features: string[];
    cta: string;
    ctaLink: string;
    popular?: string;
    yearlyDiscountPercent?: number;
  }
  export interface PricingCardProps {
    plan: PricingPlan;
    isYearly: boolean;
    highlighted?: boolean;
    onSubscribe?: () => void;
  }
  export const PricingCard: React.ComponentType<PricingCardProps>;
}

declare module "@/components/pricing/FeatureComparisonTable" {
  import * as React from "react";
  export interface FeatureRow {
    feature: string;
    starter: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
    individual: boolean | string;
  }
  export interface FeatureComparisonTableProps {
    title: string;
    features: FeatureRow[];
  }
  export const FeatureComparisonTable: React.ComponentType<FeatureComparisonTableProps>;
}

// Specific declarations for UI components that need explicit exports
declare module "@/components/ui/dialog" {
  import * as React from "react";
  export const Dialog: any;
  export const DialogTrigger: any;
  export const DialogContent: React.ComponentType<any>;
  export const DialogClose: any;
  export const DialogOverlay: any;
  export const DialogPortal: any;
  export const DialogHeader: any;
  export const DialogFooter: any;
  export const DialogTitle: any;
  export const DialogDescription: any;
}

declare module "@/components/ui/label" {
  import * as React from "react";
  export const Label: React.ComponentType<any>;
}

declare module "@/components/ui/input" {
  import * as React from "react";
  export const Input: React.ComponentType<any>;
}

declare module "@/components/ui/separator" {
  import * as React from "react";
  export const Separator: React.ComponentType<any>;
}

declare module "@/components/ui/sheet" {
  import * as React from "react";
  export const Sheet: any;
  export const SheetTrigger: any;
  export const SheetContent: React.ComponentType<any>;
  export const SheetClose: any;
  export const SheetOverlay: any;
  export const SheetPortal: any;
  export const SheetHeader: any;
  export const SheetFooter: any;
  export const SheetTitle: any;
  export const SheetDescription: any;
}

declare module "@/components/ui/skeleton" {
  import * as React from "react";
  export const Skeleton: React.ComponentType<any>;
}

declare module "@/components/ui/tooltip" {
  import * as React from "react";
  export const Tooltip: any;
  export const TooltipTrigger: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
}

// Generic declarations for other UI components
declare module "@/components/ui/accordion" {
  export const Accordion: any;
  export const AccordionItem: any;
  export const AccordionTrigger: any;
  export const AccordionContent: any;
}
declare module "@/components/ui/alert-dialog" {
  export const AlertDialog: any;
  export const AlertDialogTrigger: any;
  export const AlertDialogContent: any;
  export const AlertDialogAction: any;
  export const AlertDialogCancel: any;
}
declare module "@/components/ui/alert" {
  export const Alert: any;
  export const AlertTitle: any;
  export const AlertDescription: any;
}
declare module "@/components/ui/aspect-ratio" {
  export const AspectRatio: any;
}
declare module "@/components/ui/avatar" {
  export const Avatar: any;
  export const AvatarImage: any;
  export const AvatarFallback: any;
}
declare module "@/components/ui/badge" {
  export const Badge: any;
}
declare module "@/components/ui/breadcrumb" {
  export const Breadcrumb: any;
}
declare module "@/components/ui/calendar" {
  export const Calendar: any;
}
declare module "@/components/ui/card" {
  export const Card: any;
  export const CardHeader: any;
  export const CardTitle: any;
  export const CardDescription: any;
  export const CardContent: any;
  export const CardFooter: any;
}
declare module "@/components/ui/carousel" {
  export const Carousel: any;
}
declare module "@/components/ui/chart" {
  export const Chart: any;
}
declare module "@/components/ui/checkbox" {
  export const Checkbox: any;
}
declare module "@/components/ui/collapsible" {
  export const Collapsible: any;
}
declare module "@/components/ui/command" {
  export const Command: any;
  export const CommandDialog: any;
  export const CommandInput: any;
  export const CommandList: any;
  export const CommandEmpty: any;
  export const CommandGroup: any;
  export const CommandItem: any;
  export const CommandShortcut: any;
  export const CommandSeparator: any;
}
declare module "@/components/ui/context-menu" {
  export const ContextMenu: any;
}
declare module "@/components/ui/drawer" {
  export const Drawer: any;
}
declare module "@/components/ui/dropdown-menu" {
  export const DropdownMenu: any;
}
declare module "@/components/ui/form" {
  export const Form: any;
  export const FormItem: any;
  export const FormLabel: any;
  export const FormControl: any;
  export const FormDescription: any;
  export const FormMessage: any;
}
declare module "@/components/ui/hover-card" {
  export const HoverCard: any;
}
declare module "@/components/ui/input-otp" {
  export const InputOTP: any;
}
declare module "@/components/ui/menubar" {
  export const Menubar: any;
}
declare module "@/components/ui/navigation-menu" {
  export const NavigationMenu: any;
}
declare module "@/components/ui/pagination" {
  export const Pagination: any;
  export const PaginationContent: any;
  export const PaginationItem: any;
  export const PaginationLink: any;
  export const PaginationNext: any;
  export const PaginationPrevious: any;
  export const PaginationEllipsis: any;
}
declare module "@/components/ui/popover" {
  export const Popover: any;
}
declare module "@/components/ui/progress" {
  export const Progress: any;
}
declare module "@/components/ui/radio-group" {
  export const RadioGroup: any;
}
declare module "@/components/ui/resizable" {
  export const ResizablePanelGroup: any;
  export const ResizablePanel: any;
  export const ResizableHandle: any;
}
declare module "@/components/ui/scroll-area" {
  export const ScrollArea: any;
}
declare module "@/components/ui/select" {
  export const Select: any;
}
declare module "@/components/ui/sidebar" {
  export const Sidebar: any;
}
declare module "@/components/ui/slider" {
  export const Slider: any;
}
declare module "@/components/ui/switch" {
  export const Switch: any;
}
declare module "@/components/ui/table" {
  export const Table: any;
}
declare module "@/components/ui/tabs" {
  export const Tabs: any;
}
declare module "@/components/ui/textarea" {
  export const Textarea: any;
}
declare module "@/components/ui/toggle-group" {
  export const ToggleGroup: any;
  export const ToggleGroupItem: any;
}
declare module "@/components/ui/use-toast" {
  export const useToast: any;
  export const toast: any;
}

