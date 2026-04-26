export const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
    <span>{label}</span>
  </div>
);
