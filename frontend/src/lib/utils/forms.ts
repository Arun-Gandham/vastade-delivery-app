import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { z } from "zod";

export const applyZodErrors = <TFieldValues extends FieldValues>(
  error: z.ZodError<TFieldValues>,
  setError: UseFormSetError<TFieldValues>
) => {
  error.issues.forEach((issue) => {
    const path = issue.path.join(".") as Path<TFieldValues>;
    if (path) {
      setError(path, { type: "manual", message: issue.message });
    }
  });
};
