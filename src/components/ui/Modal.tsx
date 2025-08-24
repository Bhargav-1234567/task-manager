// components/ui/Modal.tsx
"use client";
import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import {  XIcon } from 'lucide-react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="min-h-32 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
      >
        <Button variant="ghost" size="sm" className=" absolute top-4 right-4" onClick={onClose}> <XIcon/></Button>
       
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}

       
        
      </div>
    </div>,
    document.body
  );
}
