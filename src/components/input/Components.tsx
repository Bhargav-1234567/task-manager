'use client';
import { cn } from '@/lib/utils';
import React, {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';

/*********************************
 * Minimal UI Kit for Next.js + TS + Tailwind
 * Components: Button, Input, Textarea, Select, Switch,
 * Modal, Popover, Tooltip, Badge, Card, Tabs, Skeleton
 *
 * Light/Dark theme supported via ThemeProvider.
 * Drop this file into your project (e.g. app/components/UiKit.tsx)
 * and ensure Tailwind dark mode is enabled (darkMode: 'class').
 *********************************/

/********************** Utils **********************/
 
/********************** Theming **********************/
type Theme = 'light' | 'dark' | 'system';
 

/********************** Button **********************/
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'solid', size = 'md', ...props }, ref
) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base'
  }[size];
  const variants = {
    solid: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    outline: 'border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900',
    ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
    soft: 'bg-indigo-600/10 text-indigo-700 hover:bg-indigo-600/20 dark:text-indigo-300'
  }[variant];
  return <button ref={ref} className={cn(base, sizes, variants, className)} {...props} />;
});

/********************** Input **********************/
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, leftIcon, rightIcon, id, ...props }, ref
) {
  const internalId = useId();
  const inputId = id || `input-${internalId}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className={cn(
        'group relative flex items-center rounded-2xl ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700',
        'bg-white dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-indigo-500'
      )}>
        {leftIcon && <span className="pl-3 pr-1 text-zinc-500 dark:text-zinc-400">{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-2xl bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400',
            'dark:text-zinc-100 focus:outline-none'
          )}
          {...props}
        />
        {rightIcon && <span className="pr-3 pl-1 text-zinc-500 dark:text-zinc-400">{rightIcon}</span>}
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

/********************** Textarea **********************/
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, error, id, className, ...props }, ref) {
  const internalId = useId();
  const taId = id || `ta-${internalId}`;
  return (
    <div className={className}>
      {label && <label htmlFor={taId} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
      <textarea
        id={taId}
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          'min-h-[100px] w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900',
          'placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
          'dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

/********************** Switch **********************/
export type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id, label, className, disabled }) => {
  const internalId = useId();
  const switchId = id || `sw-${internalId}`;
  return (
    <label htmlFor={switchId} className={cn('inline-flex cursor-pointer select-none items-center gap-3', disabled && 'opacity-50 cursor-not-allowed', className)}>
      {label && <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>}
      <span className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
      )}>
        <input
          id={switchId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          aria-checked={checked}
          role="switch"
        />
        <span className={cn(
          'ml-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition',
          checked ? 'translate-x-5' : 'translate-x-0',
          'shadow'
        )} />
      </span>
    </label>
  );
};

/********************** Select (Custom) **********************/
export type Option = { label: string; value: string };
export type SelectProps = {
  value?: string;
  onValueChange?: (val: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export const Select: React.FC<SelectProps> = ({ value, onValueChange, options, placeholder = 'Select…', className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex w-full items-center justify-between rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm',
          'text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : <span className="text-zinc-400">{placeholder}</span>}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white p-1 shadow-lg',
            'dark:border-zinc-800 dark:bg-zinc-900'
          )}
        >
          {options.map(opt => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                onClick={() => { onValueChange?.(opt.value); setOpen(false); }}
                className={cn(
                  'w-full rounded-xl px-3 py-2 text-left text-sm',
                  opt.value === value
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/********************** Modal **********************/
export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOutsideClick?: boolean;
};

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, description, children, footer, closeOnOutsideClick = true }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onOpenChange]);

  if (!open) return null;

  const onOverlay = (e: React.MouseEvent) => {
    if (!closeOnOutsideClick) return;
    if (e.target === overlayRef.current) onOpenChange(false);
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlay}
      className={cn(
        'fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm',
        'animate-[fadeIn_120ms_ease-out]'
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200',
          'dark:bg-zinc-950 dark:ring-zinc-800'
        )}
      >
        {(title || description) && (
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            {title && <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
          </div>
        )}
        <div className="px-6 py-5 text-zinc-800 dark:text-zinc-200">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/********************** Popover **********************/
export type PopoverProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export const Popover: React.FC<PopoverProps> = ({ trigger, content, align = 'center', className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div
          role="dialog"
          className={cn(
            'absolute z-30 mt-2 min-w-[14rem] rounded-2xl border border-zinc-200 bg-white p-3 text-sm shadow-xl',
            'dark:border-zinc-800 dark:bg-zinc-900',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

/********************** Tooltip **********************/
export type TooltipProps = { children: React.ReactNode; text: string; };
export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className={cn(
          'absolute z-40 -translate-x-1/2 translate-y-2 rounded-xl bg-zinc-900 px-2 py-1 text-xs text-white',
          'left-1/2 top-full whitespace-nowrap shadow'
        )}>
          {text}
        </span>
      )}
    </span>
  );
};

/********************** Badge **********************/
export const Badge: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger'; className?: string }>
  = ({ children, tone = 'neutral', className }) => {
  const tones: Record<string, string> = {
    neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>{children}</span>;
};

/********************** Card **********************/
export const Card: React.FC<{ title?: string; className?: string; children: React.ReactNode; footer?: React.ReactNode }>
  = ({ title, className, children, footer }) => (
  <div className={cn('rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950', className)}>
    {title && <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>}
    <div className="text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
    {footer && <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">{footer}</div>}
  </div>
);

/********************** Tabs **********************/
export type Tab = { id: string; label: string; content: React.ReactNode };
export const Tabs: React.FC<{ tabs: Tab[]; defaultTab?: string; className?: string }>
  = ({ tabs, defaultTab, className }) => {
  const [active, setActive] = useState<string>(defaultTab || tabs[0]?.id);
  return (
    <div className={className}>
      <div className="flex gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900">
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => setActive(t.id)}
            className={cn('rounded-xl px-3 py-2 text-sm transition',
              active === t.id ? 'bg-white shadow-sm dark:bg-zinc-800' : 'hover:bg-white/60 dark:hover:bg-zinc-800/60')}
          >{t.label}</button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
};

/********************** Skeleton **********************/
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800', className)} />
);

 
