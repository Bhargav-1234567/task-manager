// components/ui/Popover.tsx
"use client";
import React, { useRef, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;                // external control
  onClose?: () => void;          // external close handler
}

export default function Popover({
  children,
  content,
  open: controlledOpen,
  onClose,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setUncontrolledOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update position on open, resize & scroll
  useEffect(() => {
    function updatePosition() {
      if (open && triggerRef.current && popoverRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();

        let top = triggerRect.bottom + 8; // below trigger
        let left = triggerRect.left;

        if (top + popoverRect.height > window.innerHeight) {
          top = triggerRect.top - popoverRect.height - 8; // show above
        }
        if (left + popoverRect.width > window.innerWidth) {
          left = window.innerWidth - popoverRect.width - 8;
        }
        if (left < 8) left = 8;

        setPosition({ top, left });
      }
    }

    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (isControlled) {
            open ? onClose?.() : null; // let parent handle open
          } else {
            setUncontrolledOpen((prev) => !prev);
          }
        }}
       >
        {children}
      </div>

      {open &&
        createPortal(
          <div
          onClick={e=>{setUncontrolledOpen(false); e.preventDefault()}}
            ref={popoverRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-[1000] w-44"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
