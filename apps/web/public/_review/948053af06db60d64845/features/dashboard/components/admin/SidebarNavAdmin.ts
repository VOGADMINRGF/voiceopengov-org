// apps/web/src/components/admin/SidebarNavAdmin.tsx
"use client";

import Link from "next/link";
import { useUser } from "@features/user/context/UserContext";
import { ADMIN_MODULES } from "@/app/admin/config/adminConfig";

export default function SidebarNavAdmin() {
  const { role, roleCompat } = useUser();

  const visible = ADMIN_MODULES.filter((mod) => {
    const roles = mod.roles ?? [];
    return roles.includes(role) || roles.includes(roleCompat);
  });

  if (visible.length === 0) return null;

  return (
    <aside className="w-56 bg-white shadow flex flex-col gap-1 p-4 dark:bg-neutral-900">
      <div className="mb-4 font-bold text-xl">Admin</div>
      {visible.map((nav) => (
        <Link
          key={nav.href}
          href={nav.href}
          className="block px-3 py-2 rounded hover:bg-violet-100 text-gray-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          {nav.label}
        </Link>
      ))}
    </aside>
  );
}
