import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ErrorState = ({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) => (
  <Card className="border-[rgba(200,30,30,0.2)]">
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-[var(--color-danger)]">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      {onRetry ? (
        <div>
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  </Card>
);
