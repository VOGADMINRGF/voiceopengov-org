"use client";

interface BadgeProps {
  text: string;
  color?: string;
  textColor?: string;
  className?: string;
}

export default function Badge({
  text,
  color = "bg-gray-200",
  textColor = "text-white",
  className = "",
}: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${color} ${textColor} ${className}`}>
      {text}
    </span>
  );
}
