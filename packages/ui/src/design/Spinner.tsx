"use client";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-coral border-t-transparent" />
    </div>
  );
}
