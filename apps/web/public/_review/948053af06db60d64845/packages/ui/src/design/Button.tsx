// packages/ui/src/design/Button.tsx
import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  isLoading = false,
  icon,
  children,
  ...props
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-semibold transition text-sm flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-coral text-white hover:bg-coral/90",
    secondary: "border border-coral text-coral hover:bg-coral/10",
    ghost: "text-coral hover:underline",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${base} ${variants[variant]} ${width} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className="loader mr-2" />}
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  );
}