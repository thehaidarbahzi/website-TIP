import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            flex h-11 w-full rounded-xl border bg-white/50 px-3 py-2 text-sm
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-slate-400
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-purple)] focus-visible:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-slate-900/50 dark:text-slate-50 dark:border-slate-700
            backdrop-blur-sm transition-all
            ${error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 dark:border-slate-700"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
