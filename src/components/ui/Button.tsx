// components/ui/Button.tsx
"use client";
import React, { ReactNode } from "react";
import clsx from "clsx";

type Variant = "bordered" | "solid" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";
type Color = "blue" | "red" | "green" | "purple" | "gray" | "yellow";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: Color;
  fullWidth?: boolean;
}

export default function Button({
  label,
  icon,
  variant = "solid",
  size = "md",
  color = "blue",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded font-medium transition focus:outline-none cursor-pointer";

  // ✅ Predefined sizes
  const sizeClasses: Record<Size, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // ✅ Fixed color map to avoid Tailwind purge issues
  const colorMap: Record<Variant, Record<Color, string>> = {
    solid: {
      blue: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
      red: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      green: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
      purple: "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
      gray: "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600",
      yellow: "bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500",
    },
    bordered: {
      blue: "border border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-800/30",
      red: "border border-red-600 text-red-600 hover:bg-red-100 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-800/30",
      green: "border border-green-600 text-green-600 hover:bg-green-100 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-800/30",
      purple: "border border-purple-600 text-purple-600 hover:bg-purple-100 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-800/30",
      gray: "border border-gray-600 text-gray-600 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-800/30",
      yellow: "border border-yellow-500 text-yellow-500 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-800/30",
    },
    ghost: {
      blue: "bg-transparent text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/30",
      red: "bg-transparent text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/30",
      green: "bg-transparent text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800/30",
      purple: "bg-transparent text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-800/30",
      gray: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/30",
      yellow: "bg-transparent text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-800/30",
    },
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeClasses[size],
        colorMap[variant][color],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label && <span>{label}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}
