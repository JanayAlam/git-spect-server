import { z } from "zod";

export const registerRequestBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(12, "Password must be no more than 12 characters long"),
});

export type TRegisterRequestBody = z.infer<typeof registerRequestBodySchema>;
