import { useEffect, useState } from "react";
import {
  ArrowUp,
  Bell,
  Compass,
  MessageCircle,
  Plus,
  Quote,
  Sparkles,
  X,
} from "lucide-react";
import { destinations, quotes } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FloatingUi() {
  const [show, setShow] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(
      () =>
        toast("Trip reminder", {
          description: "Your Santorini trip starts in 24 days — 3 tasks still open.",
          icon: <Bell className="h-4 w-4" />,
        }),
      2500,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-[min(100%-1.5rem,80rem)] flex-col items-end gap-3 pb-5">
        {chatOpen ? (
          <div className="glass pointer-events-auto w-[min(100%,20rem)] rounded-3xl p-4 shadow-lift animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="gradient-brand grid h-8 w-8 shrink-0 place-items-center rounded-xl text-primary-foreground">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <p className="truncate text-sm font-semibold">Trip assistant</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Close assistant"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <p className="rounded-2xl bg-secondary p-3">
                Hi! Ask me about budgets, packing or the best time to visit.
              </p>
              <p className="gradient-brand ml-auto w-fit rounded-2xl p-3 text-primary-foreground">
                What should I pack for Santorini?
              </p>
            </div>
            <input
              aria-label="Message the trip assistant"
              placeholder="Type a message…"
              className="mt-3 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
            />
          </div>
        ) : null}

        {fabOpen ? (
          <div className="glass pointer-events-auto grid gap-1 rounded-2xl p-2 shadow-lift animate-in slide-in-from-bottom-2">
            {[
              { label: "New trip", href: "#itinerary" },
              { label: "Add expense", href: "#budget" },
              { label: "Add packing item", href: "#packing" },
            ].map((a) => (
              <a
                key={a.label}
                href={a.href}
                onClick={() => setFabOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                {a.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className={cn(
              "glass grid h-12 w-12 place-items-center rounded-2xl shadow-soft transition-all duration-500",
              show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setChatOpen((o) => !o)}
            aria-label="Open trip assistant"
            className="glass grid h-12 w-12 place-items-center rounded-2xl shadow-soft transition-transform hover:scale-105"
          >
            <MessageCircle className="h-5 w-5 text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setFabOpen((o) => !o)}
            aria-label="Quick actions"
            aria-expanded={fabOpen}
            className="ripple gradient-brand grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            <Plus className={cn("h-6 w-6 transition-transform", fabOpen && "rotate-45")} />
          </button>
        </div>
      </div>

      <aside className="pointer-events-none fixed bottom-5 left-5 z-[55] hidden max-w-xs xl:block">
        <div className="glass pointer-events-auto rounded-3xl p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Quote className="h-3.5 w-3.5" aria-hidden />
            Quote of the day
          </div>
          <p className="mt-2 text-sm text-pretty">{quote}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Recently viewed
          </div>
          <div className="mt-2 flex gap-2">
            {destinations.slice(0, 4).map((d) => (
              <img
                key={d.id}
                src={d.image}
                alt={d.name}
                loading="lazy"
                width={800}
                height={600}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
