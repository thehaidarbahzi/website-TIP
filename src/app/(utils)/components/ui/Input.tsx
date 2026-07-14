import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "glass";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, variant = "default", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isGlass = variant === "glass";

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className={`text-sm font-bold ${isGlass ? "text-white drop-shadow-sm" : "text-slate-700 dark:text-slate-300"}`}>
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            flex h-12 w-full rounded-xl border px-4 py-2 text-sm shadow-sm transition-all
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-purple)]/30 focus-visible:border-[var(--color-brand-purple)]
            disabled:cursor-not-allowed disabled:opacity-50
            ${isGlass 
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:bg-white/20 hover:border-white/40 backdrop-blur-md" 
              : "bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 hover:border-slate-400 dark:bg-slate-900 dark:text-white dark:border-slate-600"
            }
            ${error ? "border-red-500 focus-visible:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400 drop-shadow-sm">{error}</p>}
        {helperText && !error && <p className={`text-xs ${isGlass ? "text-white/70" : "text-slate-500"}`}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
