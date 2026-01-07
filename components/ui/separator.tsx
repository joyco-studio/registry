'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const separatorVariants = cva('bg-border shrink-0', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    brackets: {
      true: 'relative before:absolute before:bg-border after:absolute after:bg-border',
      false: '',
    },
    align: {
      top: '',
      center: '',
      bottom: '',
    },
  },
  compoundVariants: [
    // Horizontal + brackets + alignment
    {
      orientation: 'horizontal',
      brackets: true,
      align: 'center',
      className:
        'before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-px after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3 after:w-px',
    },
    {
      orientation: 'horizontal',
      brackets: true,
      align: 'top',
      className:
        'before:left-0 before:top-0 before:h-3 before:w-px after:right-0 after:top-0 after:h-3 after:w-px',
    },
    {
      orientation: 'horizontal',
      brackets: true,
      align: 'bottom',
      className:
        'before:left-0 before:bottom-0 before:h-3 before:w-px after:right-0 after:bottom-0 after:h-3 after:w-px',
    },
    // Vertical + brackets + alignment
    {
      orientation: 'vertical',
      brackets: true,
      align: 'center',
      className:
        'before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-3 before:h-px after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-px',
    },
    {
      orientation: 'vertical',
      brackets: true,
      align: 'top',
      className:
        'before:top-0 before:left-0 before:w-3 before:h-px after:bottom-0 after:left-0 after:w-3 after:h-px',
    },
    {
      orientation: 'vertical',
      brackets: true,
      align: 'bottom',
      className:
        'before:top-0 before:right-0 before:w-3 before:h-px after:bottom-0 after:right-0 after:w-3 after:h-px',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    brackets: false,
    align: 'center',
  },
})

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  brackets = false,
  align = 'center',
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ orientation, brackets, align }),
        className
      )}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
