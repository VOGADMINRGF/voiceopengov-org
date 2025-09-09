"use client";

import IntroSection from "@components/IntroSection";
import SwipeTeaser from "@components/SwipeTeaser";
import Link from "next/link";
import Button from "@ui/design/Button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <IntroSection />
      <SwipeTeaser />
      <section className="px-6 py-16 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Deine Stimme zählt – jetzt eigenes Statement erstellen</h2>
          <p className="mt-3 text-gray-700">
            Formuliere deinen Standpunkt in wenigen Schritten und bring dich in die Debatte ein. Andere können zustimmen, widersprechen oder Alternativen vorschlagen.
          </p>
          <div className="mt-6">
            <Link href="/beitraege/neu"><Button variant="primary">Statement verfassen</Button></Link>
          </div>
          <p className="mt-2 text-sm text-gray-500">Du kannst später jederzeit bearbeiten oder zurückziehen.</p>
        </div>
      </section>
    </main>
  );
}
