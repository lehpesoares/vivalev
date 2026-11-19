import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-pink-600 text-white hover:bg-pink-700 shadow-md shadow-pink-200 hover:shadow-pink-300',
        barbie:
          'bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300',
        outline:
          'border border-pink-200 bg-white hover:bg-pink-50 text-pink-700 hover:text-pink-800 hover:border-pink-300',
        secondary:
          'bg-pink-100 text-pink-900 hover:bg-pink-200/80',
        ghost: 'hover:bg-pink-50 text-pink-700 shadow-none',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        link: 'text-pink-600 underline-offset-4 hover:underline shadow-none p-0 h-auto',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
