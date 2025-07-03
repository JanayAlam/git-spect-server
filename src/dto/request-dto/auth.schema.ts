import { z } from "zod";

const emailField = z.string().email();
const passwordField = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(12, "Password must be no more than 12 characters long");

export const registerRequestBodySchema = z
  .object({
    email: emailField,
    password: passwordField,
  })
  .strict();

export const loginRequestBodySchema = z
  .object({
    email: emailField,
    password: passwordField,
  })
  .strict();

export const refreshAccessTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type TRegisterRequestBody = z.infer<typeof registerRequestBodySchema>;
export type TLoginRequestBody = z.infer<typeof loginRequestBodySchema>;
export type TRefreshAccessTokenRequestBody = z.infer<
  typeof refreshAccessTokenBodySchema
>;
