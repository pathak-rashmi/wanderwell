import type { Request, Response } from "express";

export function getProfile(request: Request, response: Response) {
  const { id, email, user_metadata, created_at, last_sign_in_at } = request.user;
  return response.json({
    id,
    email,
    metadata: user_metadata,
    createdAt: created_at,
    lastSignInAt: last_sign_in_at,
  });
}