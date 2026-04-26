"use client";

import { Button } from "@/components/ui/button";

export const QuantityStepper = ({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) => (
  <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white">
    <Button
      type="button"
      variant="ghost"
      className="rounded-full px-3 py-2"
      disabled={disabled || value <= 1}
      onClick={() => onChange(value - 1)}
    >
      -
    </Button>
    <span className="min-w-10 text-center text-sm font-semibold">{value}</span>
    <Button
      type="button"
      variant="ghost"
      className="rounded-full px-3 py-2"
      disabled={disabled}
      onClick={() => onChange(value + 1)}
    >
      +
    </Button>
  </div>
);
