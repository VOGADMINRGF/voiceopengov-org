export default function ImpactIndicator({ impact }) {
    return (
      <div className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded mb-2">
        <strong className="capitalize">{impact.type}:</strong> {impact.description}
      </div>
    );
  }
  