import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:backdrop-blur-[12px] group-[.toaster]:border-[1.5px] group-[.toaster]:shadow-[0_10px_30px_rgba(0,0,0,0.2),0_0_0_1px_rgba(59,130,246,0.1)] dark:group-[.toaster]:shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_0_1px_rgba(96,165,250,0.2)]",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
