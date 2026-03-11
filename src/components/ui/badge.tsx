import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "red" | "yellow" | "green";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800"
};

export function Badge({ children, tone = "blue" }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{children}</span>;
}
