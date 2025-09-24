// apps/web/src/components/profile/UserProfile.tsx
"use client";
import React from "react";

export default function UserProfile({ name = "Nutzer:in" }: { name?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="text-sm text-gray-500">Profil</div>
      <div className="text-xl font-semibold">{name}</div>
    </div>
  );
}
