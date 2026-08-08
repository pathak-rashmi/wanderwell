import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toError(error: unknown) {
  return error instanceof Error ? error : new Error("Authentication failed");
}

async function syncProfile(user: User) {
  const displayName =
    user.user_metadata["full_name"] ?? user.user_metadata["name"] ?? user.email?.split("@")[0] ?? "Traveler";
  const avatarUrl = user.user_metadata["avatar_url"] ?? user.user_metadata["picture"] ?? null;

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: displayName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

function clearOAuthHash() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (!hash.includes("access_token=") && !hash.includes("refresh_token=") && !hash.includes("error=")) {
    return;
  }

  window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
      setAuthError(null);
      if (nextSession?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        void syncProfile(nextSession.user).catch((error: unknown) => setAuthError(toError(error)));
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setAuthError(toError(error));
        setSession(data.session);
        setLoading(false);
        clearOAuthHash();
        if (data.session?.user) {
          void syncProfile(data.session.user).catch((profileError: unknown) => setAuthError(toError(profileError)));
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(toError(error));
        setLoading(false);
        clearOAuthHash();
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,
    error: authError,
    signInWithOtp: async (email) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      return { error: error ? toError(error) : null };
    },
    verifyOtp: async (email, token) => {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
      return { error: error ? toError(error) : null };
    },
    signInWithGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      return { error: error ? toError(error) : null };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error: error ? toError(error) : null };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}