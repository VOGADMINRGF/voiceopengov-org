import { cookies } from "next/headers";

// Der Next-Typ mismatch in diesem Scope: hart casten
const role = (cookies() as any)?.get?.("u_role")?.value ?? "guest";

export default function SiteHeader() {
  return <header>{role}</header>;
}
