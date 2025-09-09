// OrgDashboard.tsx

import { Organization } from "../models/Organization";
import { isOrgPremium, canAddMoreMembers } from "../utils/orgHelpers";

interface OrgDashboardProps {
  org: Organization | null;
}

export default function OrgDashboard({ org }: OrgDashboardProps) {
  if (!org) return <div>Keine Organisation ausgewählt.</div>;

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold">{org.name}</h1>
      <div className="my-3">
        Status: {org.verified ? "✅ Verifiziert" : "⚠️ Nicht verifiziert"}<br />
        Account: {isOrgPremium(org) ? "🌟 Premium" : "Standard"}
      </div>

      <h2 className="text-lg font-semibold">Mitglieder</h2>
      <ul className="list-disc ml-5">
        {org.members.map((member, idx) => (
          <li key={idx}>
            {member.userId} ({member.subRole})
          </li>
        ))}
      </ul>
      {canAddMoreMembers(org) ? (
        <button className="mt-4 bg-violet-500 text-white px-4 py-2 rounded">
          Mitglied hinzufügen
        </button>
      ) : (
        <p className="mt-4 text-red-500">Maximale Mitgliederzahl erreicht.</p>
      )}
    </div>
  );
}
