// components/ui/Radio.tsx
"use client";
import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const radioId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            className={`w-5 h-5 border 
              text-blue-600 focus:ring-2 
              ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-700 focus:ring-blue-400"}
              ${className}`}
            {...props}
          />
          {label && (
            <label htmlFor={radioId} className="text-sm text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Radio.displayName = "Radio";
export default Radio;
