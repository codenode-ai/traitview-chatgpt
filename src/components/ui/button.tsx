import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const base = "inline-flex items-center justify-center rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none hover-btn";
const variants: Record<string,string> = {
  default: "bg-primary text-black border-transparent hover:opacity-90",
  outline: "bg-white text-black border-border hover:bg-muted",
  ghost: "bg-transparent border-transparent hover:bg-muted"
};
const sizes: Record<string,string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-base"
};

export function Button({ asChild, className, variant = "default", size = "md", ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
