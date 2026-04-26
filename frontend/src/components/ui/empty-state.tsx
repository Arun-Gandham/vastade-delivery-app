import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Card className="flex flex-col items-start gap-3">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
  </Card>
);
