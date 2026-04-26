import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "surface-panel rounded-[var(--radius-xl)] p-4 transition duration-200 md:hover:-translate-y-0.5",
      className
    )}
    {...props}
  />
);
