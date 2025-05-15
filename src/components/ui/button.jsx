import React from "react"
import clsx from "clsx"

export function Button({
  children,
  className = "",
  variant = "solid",
  size = "base",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none"

  const variantStyles = {
    solid: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700",
    ghost: "text-gray-400 hover:text-white hover:bg-gray-700",
  }

  const sizeStyles = {
    base: "px-4 py-2 text-sm",
    icon: "p-2 w-10 h-10",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
