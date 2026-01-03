import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Status colors
        success:
          "border-transparent text-white hover:opacity-90",
        cancelled:
          "border-transparent text-white hover:opacity-90",
        // Priority colors
        "high-priority":
          "border-transparent text-white hover:opacity-90",
        "medium-priority":
          "border-transparent text-white hover:opacity-90",
        "low-priority":
          "border-transparent text-white hover:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, style, ...props }: BadgeProps) {
  // Map variants to specific hex colors
  const variantStyles: Record<string, React.CSSProperties> = {
    success: { backgroundColor: '#22C55E' },
    cancelled: { backgroundColor: 'red' },
    'high-priority': { backgroundColor: '#DC2626' },
    'medium-priority': { backgroundColor: '#F59E0B' },
    'low-priority': { backgroundColor: '#3B82F6' },
  };

  const combinedStyle = variant && variantStyles[variant]
    ? { ...variantStyles[variant], ...style }
    : style;

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={combinedStyle}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
