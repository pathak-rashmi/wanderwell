import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Globe2, Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle, signInWithOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/" });
  }, [loading, navigate, user]);

  const sendOtp = async () => {
    setMessage(null);
    setBusy(true);
    const { error } = await signInWithOtp(email.trim());
    setBusy(false);
    if (error) return setMessage({ type: "error", text: error.message });
    setOtpSent(true);
    setMessage({ type: "success", text: "Your six-digit code is on its way." });
  };

  const verify = async () => {
    setMessage(null);
    setBusy(true);
    const { error } = await verifyOtp(email.trim(), otp.trim());
    setBusy(false);
    if (error) return setMessage({ type: "error", text: error.message });
    setMessage({ type: "success", text: "You are in. Opening your workspace..." });
    void navigate({ to: "/" });
  };

  const google = async () => {
    setMessage(null);
    setBusy(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setBusy(false);
      setMessage({ type: "error", text: error.message });
    }
  };

  if (loading || user) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <main className="gradient-aurora min-h-screen overflow-hidden px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
        <section className="hidden lg:block">
          <div className="flex items-center gap-3 font-display text-lg font-bold">
            <span className="gradient-brand grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shadow-glow"><Globe2 className="h-5 w-5" /></span>
            WanderWell
          </div>
          <p className="mt-20 max-w-xl font-display text-6xl font-bold leading-[1.02] tracking-tight text-foreground">
            Your next great escape starts here.
          </p>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
            Keep every destination, detail, and little spark of anticipation in one beautiful workspace.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm font-semibold text-foreground">
            {["Plan with clarity", "Keep it personal", "Travel lighter"].map((item) => <span key={item} className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2"><Check className="h-4 w-4 text-primary" />{item}</span>)}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card/90 p-6 shadow-lift backdrop-blur sm:p-8">
          <div className="lg:hidden"><div className="flex items-center gap-2 font-display text-lg font-bold"><span className="gradient-brand grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"><Globe2 className="h-5 w-5" /></span>WanderWell</div></div>
          <div className="mt-8 sm:mt-2"><span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" /> Welcome, traveler</span><h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Plan your way in.</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use Google or a one-time email code. No password to remember.</p></div>
          <Button type="button" variant="outline" className="mt-7 h-11 w-full rounded-xl" onClick={() => void google()} disabled={busy}><span className="mr-2 grid h-5 w-5 place-items-center rounded-full bg-foreground text-xs font-bold text-background">G</span>Continue with Google</Button>
          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><span className="h-px flex-1 bg-border" />or email code<span className="h-px flex-1 bg-border" /></div>
          <div className="space-y-2"><Label htmlFor="auth-email">Email address</Label><div className="relative"><Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 rounded-xl pl-10" autoComplete="email" /></div></div>
          {!otpSent ? <Button type="button" className="gradient-brand mt-4 h-11 w-full rounded-xl text-primary-foreground" onClick={() => void sendOtp()} disabled={busy || !email.trim()}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Send OTP<ArrowRight className="ml-2 h-4 w-4" /></Button> : <div className="mt-4 space-y-3"><div className="space-y-2"><Label htmlFor="auth-otp">Verification code</Label><Input id="auth-otp" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" className="h-11 rounded-xl text-center text-lg tracking-[0.35em]" /></div><Button type="button" className="gradient-brand h-11 w-full rounded-xl text-primary-foreground" onClick={() => void verify()} disabled={busy || otp.length !== 6}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Verify OTP</Button><button type="button" className="w-full text-center text-sm font-semibold text-primary hover:underline" onClick={() => { setOtpSent(false); setOtp(""); }}>Use a different email</button></div>}
          {message ? <p role="status" className={`mt-4 rounded-xl px-3 py-2 text-sm ${message.type === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald/10 text-emerald"}`}>{message.text}</p> : null}
          <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to keep your travel plans kind, curious, and yours.</p>
        </section>
      </div>
    </main>
  );
}