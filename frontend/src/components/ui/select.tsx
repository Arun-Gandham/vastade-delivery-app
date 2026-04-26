import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
};

export const Select = ({ label, error, options, className, id, ...props }: SelectProps) => {
  const selectId = id || props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[var(--color-text)]" htmlFor={selectId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(31,157,85,0.15)]",
          error ? "border-[var(--color-danger)]" : "",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
};
