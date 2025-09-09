// apps/web/src/app/swipe/page.tsx
"use client";

import SwipeDeck from "@features/swipe/components/SwipeDeck";

export default function SwipePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="flex flex-col items-center mt-8">
        <SwipeDeck />
      </div>
    </div>
  );
}
