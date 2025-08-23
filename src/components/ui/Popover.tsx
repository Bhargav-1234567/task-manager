// components/ui/Popover.tsx
"use client";
import React, { useRef, useState, useEffect, ReactNode } from "react";

interface PopoverProps {
  button: ReactNode;
  children: ReactNode;
}

export default function Popover({ button, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        {button}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 rounded-xl shadow-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}
