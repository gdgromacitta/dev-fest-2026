import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return <span className="inline-flex rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700">{children}</span>;
}
