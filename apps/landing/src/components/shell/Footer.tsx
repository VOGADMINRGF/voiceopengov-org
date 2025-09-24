"use client";

import SubscribeForm from "@/components/newsletter/SubscribeForm";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 py-12 text-sm text-slate-600">
      <div className="container grid gap-6 md:grid-cols-2 items-start">
        <div>
          <div className="font-semibold text-slate-800">VoiceOpenGov</div>
          <p className="mt-2 max-w-prose">
          Schön, dass Du da bist – jede Unterstützung hilft uns, Tempo zu machen.
          Wir finanzieren uns durch Mitglieder – nicht durch Werbung oder verkauf deiner Daten. 
          <br/>Hilf mit, unsere Unabhängigkeit zu sichern.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} VoiceOpenGov</p>
        </div>

        <div className="justify-self-end w-full">
          <h3 className="text-base font-semibold mb-1 text-slate-800">Updates erhalten</h3>
          <p className="text-xs text-slate-600 mb-3">
          Noch keine Mitgliedschaft? Dann bekommst Du hier 1–2 kurze Updates im Monat zu Features, Abstimmungen & Roadmap.
          Kein Spam. Abmeldung jederzeit möglich.
          </p>
          <SubscribeForm compact />
        </div>
      </div>
    </footer>
  );
}
