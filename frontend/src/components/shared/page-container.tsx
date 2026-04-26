import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const PageContainer = ({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("app-shell flex flex-col gap-6", className)}>
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
      </div>
      {actions}
    </header>
    {children}
  </section>
);
