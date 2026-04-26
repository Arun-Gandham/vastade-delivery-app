export const optionalTrimmedString = (value?: string | null) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const nullableTrimmedString = (value?: string | null) => optionalTrimmedString(value) ?? null;
