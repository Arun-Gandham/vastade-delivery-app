import { cn } from "@/lib/utils/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)]", className)} />
);
