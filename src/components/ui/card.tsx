import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type CardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "div">({ as, children, className = "", ...props }: CardProps<T>) {
  const Comp = as ?? "div";
  return (
    <Comp className={`flat-card focus-ring block p-4 ${className}`.trim()} {...props}>
      {children}
    </Comp>
  );
}
