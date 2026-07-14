import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-orange)] text-white hover:opacity-90 shadow-md focus:ring-[var(--color-brand-purple)]",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 focus:ring-slate-400",
    outline: "border-2 border-[var(--color-brand-purple)] text-[var(--color-brand-purple)] hover:bg-[var(--color-brand-purple)] hover:text-white focus:ring-[var(--color-brand-purple)]",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
