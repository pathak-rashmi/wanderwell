import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase.js";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export type AuthenticatedRequest = Request;

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!token) {
    return response.status(401).json({ message: "Authentication required" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return response.status(401).json({ message: "Invalid or expired Supabase session" });
    }

    request.user = data.user;
    return next();
  } catch {
    return response.status(401).json({ message: "Unable to verify Supabase session" });
  }
}