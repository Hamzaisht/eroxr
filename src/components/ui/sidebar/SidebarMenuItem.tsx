import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 rounded-lg p-3 text-luxury-neutral outline-none ring-luxury-primary/20 transition-all duration-300 hover:bg-luxury-primary/10 hover:text-luxury-primary focus-visible:ring-2 [&>svg]:size-5 [&>svg]:transition-transform [&>svg]:duration-300 group-hover:scale-105",
  {
    variants: {
      variant: {
        default: "hover:bg-luxury-primary/10 hover:text-luxury-primary",
        active: "bg-luxury-primary/10 text-luxury-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  asChild?: boolean;
  variant?: "default" | "active";
}

export function SidebarMenuItem({ 
  className,
  children,
  asChild = false,
  variant = "default",
  ...props 
}: SidebarMenuItemProps) {
  const Comp = asChild ? Slot : "li";
  
  return (
    <Comp
      className={cn(
        "group/menu-item relative",
        sidebarMenuButtonVariants({ variant }),
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}