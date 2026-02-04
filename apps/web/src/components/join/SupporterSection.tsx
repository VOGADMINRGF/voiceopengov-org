type Mode = "reuse" | "separate";

export function SupporterSection({
  enabled,
  mode,
  onEnabledChange,
  onModeChange,
}: {
  enabled: boolean;
  mode: Mode;
  onEnabledChange: (v: boolean) => void;
  onModeChange: (mode: Mode) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Als Unterstützer genannt werden (optional)
          </div>
          <div className="text-sm text-slate-600">
            Öffentlich zeigen wir nur gekürzten Namen und optional ein Bild/Logo - keine Rohdaten.
          </div>
        </div>
      </label>

      {enabled ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onModeChange("reuse");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "reuse"
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Profilbild/Logo verwenden
            </button>
            <button
              type="button"
              onClick={() => {
                onModeChange("separate");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "separate"
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Anderes Bild hochladen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
