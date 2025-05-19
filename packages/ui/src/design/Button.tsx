import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-semibold transition text-sm";
  const styles = {
    primary: "bg-coral text-white hover:bg-coral/90",
    secondary: "border border-coral text-coral hover:bg-coral/10",
    ghost: "text-coral hover:underline",
  };
  const width = fullWidth ? "w-full" : "";

  return (
    <button className={`${base} ${styles[variant]} ${width} ${className}`} {...props} />
  );
}
