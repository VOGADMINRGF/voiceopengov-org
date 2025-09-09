"use client";
import { useState } from "react";
import QRCodeWizard from "@/components/QRCodeWizard";  // Der große Wizard-Flow

export default function QRCodeGeneratorPage() {
  // In Produktion: useAuth() oder echten User-Kontext!
  const [user] = useState({ id: "testuser1", name: "Max Mustermann", role: "user" });

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      <QRCodeWizard user={user} />
    </main>
  );
}
