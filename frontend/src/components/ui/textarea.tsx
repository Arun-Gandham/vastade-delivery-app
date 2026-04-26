import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = ({ label, error, className, id, ...props }: TextareaProps) => {
  const textareaId = id || props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[var(--color-text)]" htmlFor={textareaId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(31,157,85,0.15)]",
          error ? "border-[var(--color-danger)]" : "",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
};
