import Link from "next/link";

const NAV = [
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/users", label: "Users" },
];

export default function SidebarNavAdmin() {
  return (
    <aside className="w-56 bg-white dark:bg-neutral-900 shadow flex flex-col gap-1 p-4">
      <div className="mb-4 font-bold text-xl">Admin</div>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className="block px-3 py-2 rounded hover:bg-violet-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          {n.label}
        </Link>
      ))}
    </aside>
  );
}
