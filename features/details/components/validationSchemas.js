import { z } from "zod";

export const stepSchemas = {
  1: z.object({
    fullName: z.string().min(1, "Full name is required"),
  }),
  2: z.object({}), 
  3: z.object({}),
  4: z.object({}),
  5: z.object({}),
  6: z.object({}),
};

export function validateStep(step, data) {
  const schema = stepSchemas[step];
  if (!schema) return true;
  const result = schema.safeParse(data);
  return result.success;
}