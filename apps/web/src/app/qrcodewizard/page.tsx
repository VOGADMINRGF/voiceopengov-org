"use client";
import QRCodeWizard from "@/components/QRCodeWizard";

const currentUser = { id: "12345", name: "Demo Admin" }; // In echt: aus Auth holen

export default function QRCodeWizardPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      <QRCodeWizard user={currentUser} onQrCreated={id => alert("QR erzeugt: " + id)} />
    </main>
  );
}
 