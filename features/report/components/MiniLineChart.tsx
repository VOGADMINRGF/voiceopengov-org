export default function MiniLineChart({ data, color = "#00B3A6" }) {
    if (!data?.length) return null;
    const max = Math.max(...data);
    const points = data.map((v, i, arr) =>
      [i * 28, 36 - ((v / max) * 32)]
    );
    return (
      <svg width={112} height={38} viewBox="0 0 112 38" className="ml-1">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points.map(p => p.join(",")).join(" ")}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} />
        ))}
      </svg>
    );
  }
  