import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/holibuilder"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

const configuredUrl = parsedEnv.data.SUPABASE_URL;
const configuredAnonKey = parsedEnv.data.SUPABASE_ANON_KEY;
const supabaseUrl = configuredUrl?.includes("your-project")
  ? parsedEnv.data.VITE_SUPABASE_URL
  : configuredUrl ?? parsedEnv.data.VITE_SUPABASE_URL;
const supabaseAnonKey = configuredAnonKey?.includes("your-supabase")
  ? parsedEnv.data.VITE_SUPABASE_ANON_KEY
  : configuredAnonKey ?? parsedEnv.data.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes("your-supabase")) {
  throw new Error(".env must define a valid SUPABASE_URL and SUPABASE_ANON_KEY");
}

if (supabaseAnonKey.startsWith("http://") || supabaseAnonKey.startsWith("https://")) {
  throw new Error("SUPABASE_ANON_KEY must be the Supabase anon JWT, not a REST API URL");
}

export const env = {
  ...parsedEnv.data,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_ANON_KEY: supabaseAnonKey,
};