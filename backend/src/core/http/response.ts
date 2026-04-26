import { Response } from "express";

export const sendSuccess = (
  res: Response,
  message: string,
  data?: unknown,
  meta?: unknown
) => res.json({ success: true, message, data, meta });
