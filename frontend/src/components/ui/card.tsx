import * as React from "react"
import { cn } from "@/lib/utils"

type CardVariant = "default" | "interactive" | "ghost"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const cardVariants: Record<CardVariant, string> = {
  default:
    "border bg-card text-card-foreground shadow-sm",
  interactive:
    "border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer",
  ghost:
    "border-none bg-transparent shadow-none",
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

/* -------------------------------------------------------------------------- */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1.5 px-6 pt-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* -------------------------------------------------------------------------- */

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* -------------------------------------------------------------------------- */

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* -------------------------------------------------------------------------- */

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-6 py-4",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

/* -------------------------------------------------------------------------- */

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-6 pb-6 pt-2",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

/* -------------------------------------------------------------------------- */

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
