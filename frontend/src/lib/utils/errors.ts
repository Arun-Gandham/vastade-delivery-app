export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message;
    return message || fallback;
  }
  return fallback;
};
