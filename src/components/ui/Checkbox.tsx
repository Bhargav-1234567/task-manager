// components/ui/Checkbox.tsx
"use client";
import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const checkboxId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            className={`w-5 h-5 rounded border 
              text-blue-600 focus:ring-2 
              ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-700 focus:ring-blue-400"}
              ${className}`}
            {...props}
          />
          {label && (
            <label htmlFor={checkboxId} className="text-sm text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
