import type { Request, Response } from "express";
import { z } from "zod";
import { supabase, supabaseWithToken } from "../utils/supabase.js";

const credentialsSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});

function validationError(response: Response, error: z.ZodError) {
  return response.status(400).json({
    message: "Validation failed",
    errors: error.flatten().fieldErrors,
  });
}

export async function register(request: Request, response: Response) {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, parsed.error);

  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    const status = error.message.toLowerCase().includes("already") ? 409 : 400;
    return response.status(status).json({ message: error.message });
  }

  return response.status(201).json({
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: data.session === null,
  });
}

export async function login(request: Request, response: Response) {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, parsed.error);

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session || !data.user) {
    return response.status(401).json({ message: error?.message ?? "Invalid email or password" });
  }

  return response.json({ user: data.user, session: data.session });
}

export async function logout(request: Request, response: Response) {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
  if (!token) return response.status(401).json({ message: "Authentication required" });

  const { error } = await supabaseWithToken(token).auth.signOut();
  if (error) return response.status(400).json({ message: error.message });
  return response.status(204).send();
}