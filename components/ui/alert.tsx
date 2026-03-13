import type { ReactNode } from "react";
import { Info, TriangleAlert, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  info: {
    icon: Info,
    className: "border-blue-500/20 bg-blue-500/5 text-blue-300",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  },
  success: {
    icon: CircleCheck,
    className: "border-green-500/20 bg-green-500/10 text-green-300",
  },
  error: {
    icon: CircleX,
    className: "border-red-500/20 bg-red-500/10 text-red-300",
  },
} as const;

interface AlertProps {
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
}

export default function Alert({ variant = "info", children, className }: AlertProps) {
  const { icon: Icon, className: variantClass } = variants[variant];

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", variantClass, className)}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
