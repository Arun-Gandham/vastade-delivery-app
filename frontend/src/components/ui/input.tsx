import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Input = ({ label, error, helperText, className, id, ...props }: InputProps) => {
  const inputId = id || props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[var(--color-text)]" htmlFor={inputId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(31,157,85,0.15)]",
          error ? "border-[var(--color-danger)]" : "",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error && helperText ? <span className="text-xs text-[var(--color-text-muted)]">{helperText}</span> : null}
    </label>
  );
};
