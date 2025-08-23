// components/ui/FileInput.tsx
"use client";
import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const fileId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={fileId} className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          id={fileId}
          ref={ref}
          type="file"
          className={`file:mr-4 file:py-2 file:px-4 
            file:rounded-xl file:border-0 
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            dark:file:bg-blue-500 dark:hover:file:bg-blue-600
            ${error ? "border border-red-500" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
export default FileInput;
