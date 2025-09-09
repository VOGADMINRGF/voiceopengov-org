export default function RightSidebar() {
  return (
    <aside className="flex flex-col gap-8 pl-4 sticky top-8 text-sm max-w-[16rem]">
      <div>
        <h4 className="font-bold text-neutral-700 mb-2">Aktuelle News & Trends</h4>
        <ul>
          <li>Migration: EU will Asylverfahren beschleunigen</li>
          <li>UN-Bericht: Integration wirkt sich positiv aus</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-neutral-700 mb-2">Community-Trends</h4>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow transition select-none">#Integration</span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow transition select-none">#Asylverfahren</span>
        </div>
      </div>
    </aside>
  );
}
