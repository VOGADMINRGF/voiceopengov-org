import type { ReactNode } from "react";
import clsx from "clsx";

export function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto max-w-6xl", className)}>{children}</div>;
}
