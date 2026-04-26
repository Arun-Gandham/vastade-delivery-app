import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects, ZodObject } from "zod";

type Schema = AnyZodObject | ZodEffects<ZodObject<any>>;

export const validateRequest =
  (schema: Schema) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  };
