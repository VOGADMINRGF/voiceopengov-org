import { cookies } from "next/headers";
export default function SiteHeader(){
  const role = cookies().get("u_role")?.value;
  return (
    <header className="...">
      {/* ... */}
      <nav className="ml-auto flex gap-4">
        {/* ... */}
        {role==="admin" && <a href="/admin" className="underline">Admin</a>}
      </nav>
    </header>
  );
}
