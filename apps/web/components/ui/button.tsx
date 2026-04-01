import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
    {
        variants: {
            variant: {
                default: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/25",
                destructive: "bg-red-600 text-white hover:bg-red-500",
                outline: "border border-white/10 bg-transparent text-white hover:bg-white/5",
                secondary: "bg-white/5 text-white hover:bg-white/10",
                ghost: "text-white hover:bg-white/5",
                link: "text-indigo-400 underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-900/30",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-xl px-6 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    )
)
Button.displayName = "Button"

export { Button, buttonVariants }
