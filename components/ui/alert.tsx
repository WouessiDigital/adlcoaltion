"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}
interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Alert({ className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-md border p-4 bg-white shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <div className={cn("font-semibold text-sm text-gray-900", className)} {...props}>
      {children}
    </div>
  )
}

export function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <div className={cn("text-sm text-gray-600 mt-1", className)} {...props}>
      {children}
    </div>
  )
}

export default Alert
