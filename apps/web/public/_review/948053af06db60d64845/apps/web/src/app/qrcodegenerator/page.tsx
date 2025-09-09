// apps/web/src/app/qrcodegenerator/page.tsx
"use client";
import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function QRCodeGeneratorPage() {
  // Beispiel: Aktueller User (Demo), in echt über Auth holen!
  const demoUserId = "65d4c2f2a1b5e21ffb3fa222"; // <- Ersetze durch echten Wert

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <QRCodeGenerator userId={demoUserId} />
    </main>
  );
}

