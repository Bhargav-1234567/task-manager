// components/ui/Select.tsx
"use client";
import React, { forwardRef, SelectHTMLAttributes, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = "", children, ...props }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`px-4 py-2 rounded-xl border outline-none 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-gray-100
            focus:ring-2 
            ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-700 focus:ring-blue-400"}
            ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
