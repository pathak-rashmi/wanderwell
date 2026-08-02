import { Facebook, Globe2, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const columns = [
  {
    title: "Plan",
    links: ["Destinations", "Budget", "Itinerary", "Packing", "Weather"],
  },
  { title: "Company", links: ["About", "Careers", "Press", "Partners"] },
  { title: "Support", links: ["Help center", "Community", "Privacy", "Terms"] },
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#home" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="gradient-brand grid h-9 w-9 place-items-center rounded-xl text-primary-foreground shadow-glow">
                <Globe2 className="h-5 w-5" aria-hidden />
              </span>
              Travel Planner
            </a>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              One calm workspace for destinations, budgets, itineraries and packing — so the
              planning feels as good as the trip.
            </p>

            <form
              className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("You're subscribed to trip inspiration");
              }}
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
              />
              <Button
                type="submit"
                className="ripple gradient-brand shrink-0 rounded-2xl text-primary-foreground hover:opacity-95"
              >
                Subscribe
              </Button>
            </form>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden /> hello@travelplanner.app
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden /> +1 (555) 018-2244
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden /> Lisbon · Singapore
              </li>
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <h3 className="font-display text-sm font-semibold">{c.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Travel Planner. Crafted for people who love the journey.
          </p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#home"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
