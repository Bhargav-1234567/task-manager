// components/ui/Toggle.tsx
"use client";
import React, { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
}

export default function Toggle({ checked = false, onChange, label, error }: ToggleProps) {
  const [isOn, setIsOn] = useState(checked);

  function handleToggle() {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition 
            ${isOn ? "bg-blue-600" : error ? "bg-red-500" : "bg-gray-300 dark:bg-gray-700"}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition 
              ${isOn ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
