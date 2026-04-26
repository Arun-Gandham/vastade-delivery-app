import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const toneClass = {
  neutral: "bg-[var(--color-muted)] text-[var(--color-text)]",
  success: "bg-[rgba(31,157,85,0.12)] text-[var(--color-success)]",
  warning: "bg-[rgba(217,119,6,0.12)] text-[var(--color-warning)]",
  danger: "bg-[rgba(200,30,30,0.12)] text-[var(--color-danger)]",
  info: "bg-[rgba(37,99,235,0.12)] text-[var(--color-info)]",
};

export const Badge = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClass }) => {
  const tone = (props as { tone?: keyof typeof toneClass }).tone || "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneClass[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
