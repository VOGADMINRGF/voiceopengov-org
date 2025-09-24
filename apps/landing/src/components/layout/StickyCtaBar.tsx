import Link from "next/link";
export default function StickyCtaBar({ locale }: { locale: string }) {
  return (
    <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:px-0">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white/90 backdrop-blur p-2 shadow">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href={`/${locale}/support`} className="rounded-lg border px-3 py-1 text-sm">Mitglied werden</Link>
          <Link href={`/${locale}/careers`} className="rounded-lg border px-3 py-1 text-sm">Bewirb dich fürs Team</Link>
          <Link href={`/${locale}/app`} className="rounded-lg border px-3 py-1 text-sm">Zur App</Link>
        </div>
      </div>
    </div>
  );
}
