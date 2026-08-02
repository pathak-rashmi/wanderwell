import { useEffect, useState } from "react";
import { Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Destinations", href: "#destinations" },
  { label: "Budget", href: "#budget" },
  { label: "Itinerary", href: "#itinerary" },
  { label: "Packing", href: "#packing" },
  { label: "Weather", href: "#weather" },
  { label: "Dashboard", href: "#dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto grid w-[min(100%-1.5rem,80rem)] grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-500 lg:px-5",
          scrolled ? "glass shadow-soft" : "border border-transparent",
        )}
      >
        <a href="#home" className="flex min-w-0 items-center gap-2 font-display font-bold">
          <span className="gradient-brand grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-glow">
            <Globe2 className="h-5 w-5" aria-hidden />
          </span>
          <span className="truncate text-base sm:text-lg">Travel Planner</span>
        </a>

        <ul className="hidden justify-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setDark((d) => !d)}
            className="rounded-xl"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" className="hidden rounded-xl sm:inline-flex">
            Login
          </Button>
          <Button className="ripple gradient-brand hidden rounded-xl text-primary-foreground shadow-glow hover:opacity-95 sm:inline-flex">
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="glass mx-auto mt-2 w-[min(100%-1.5rem,80rem)] rounded-2xl p-3 shadow-soft lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" className="rounded-xl">
              Login
            </Button>
            <Button className="gradient-brand rounded-xl text-primary-foreground">
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
