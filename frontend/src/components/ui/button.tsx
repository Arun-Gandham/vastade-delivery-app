"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "icon";
  loading?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:scale-[0.99]",
  secondary: "bg-[var(--color-secondary)] text-white hover:opacity-95 active:scale-[0.99]",
  outline:
    "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-[var(--color-muted)]",
  ghost: "text-[var(--color-text)] hover:bg-[var(--color-muted)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-95",
  success: "bg-[var(--color-success)] text-white hover:opacity-95",
  icon: "bg-[var(--color-muted)] text-[var(--color-text)] hover:bg-[var(--color-border)]",
};

export const Button = ({
  className,
  variant = "primary",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? "Please wait..." : children}
  </button>
);
