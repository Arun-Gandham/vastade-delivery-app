import { Card } from "@/components/ui/card";

export const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <Card className="flex flex-col gap-2">
    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
    {hint ? <p className="text-sm text-[var(--color-text-muted)]">{hint}</p> : null}
  </Card>
);
