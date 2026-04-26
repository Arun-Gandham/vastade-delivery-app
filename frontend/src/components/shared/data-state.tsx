import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const DataState = ({
  isLoading,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  onRetry,
  children,
}: {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  children: ReactNode;
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle || "Nothing here yet"}
        description={emptyDescription || "Try again after updating your filters."}
      />
    );
  }

  return <>{children}</>;
};
