import { useMemo } from "react";
import { CalendarDays, CheckCircle2, MapPin, NotebookPen, Timer, Wallet } from "lucide-react";
import type { PackCategory } from "@/lib/travel-data";
import { useCountdown } from "@/hooks/use-travel";
import { Progress } from "@/components/ui/progress";
import { Reveal, Section, SectionHeader } from "./Section";

const expenses = [
  { label: "Flights", value: 850 },
  { label: "Hotels", value: 1200 },
  { label: "Food", value: 480 },
  { label: "Transport", value: 220 },
  { label: "Activities", value: 390 },
  { label: "Shopping", value: 260 },
];

const tasks = [
  { label: "Confirm airport transfer", due: "in 2 days" },
  { label: "Download offline maps", due: "in 4 days" },
  { label: "Exchange €200 cash", due: "in 5 days" },
  { label: "Check-in online", due: "in 9 days" },
];

export function Dashboard({ packing }: { packing: PackCategory[] }) {
  const tripDate = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 24), []);
  const { days, hours, minutes, seconds } = useCountdown(tripDate);

  const items = packing.flatMap((c) => c.items);
  const packedPct = items.length
    ? Math.round((items.filter((i) => i.done).length / items.length) * 100)
    : 0;

  const total = expenses.reduce((a, b) => a + b.value, 0);
  const max = Math.max(...expenses.map((e) => e.value));

  const stats = [
    { icon: MapPin, label: "Destination", value: "Santorini" },
    { icon: CalendarDays, label: "Days remaining", value: `${days}` },
    { icon: Wallet, label: "Budget used", value: "76%" },
    { icon: CheckCircle2, label: "Packing progress", value: `${packedPct}%` },
    { icon: NotebookPen, label: "Activities planned", value: "10" },
    { icon: Timer, label: "Trip duration", value: "6 days" },
  ];

  return (
    <Section id="dashboard" className="gradient-aurora">
      <SectionHeader
        eyebrow="Dashboard"
        title="Your whole trip at a glance"
        description="Every moving part of the trip — money, packing, activities and countdown — in one live view."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-lift rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="mt-4 font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">Expenses</h3>
              <span className="text-sm text-muted-foreground">
                ${total.toLocaleString()} tracked
              </span>
            </div>
            <div className="mt-6 flex h-52 items-stretch gap-3">
              {expenses.map((e) => (
                <div
                  key={e.label}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-semibold tabular-nums">${e.value}</span>
                  <div className="flex h-full w-full items-end">
                    <span
                      className="gradient-brand w-full rounded-t-xl transition-all duration-700"
                      style={{ height: `${(e.value / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[11px] text-muted-foreground">
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <div className="glass rounded-3xl p-6 shadow-lift">
            <h3 className="font-display text-lg font-semibold">Countdown to takeoff</h3>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                { v: days, l: "Days" },
                { v: hours, l: "Hrs" },
                { v: minutes, l: "Min" },
                { v: seconds, l: "Sec" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-secondary py-3">
                  <div className="font-display text-2xl font-bold tabular-nums">
                    {String(x.v).padStart(2, "0")}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
            <Progress value={packedPct} className="mt-5 h-2.5 rounded-full" />
            <p className="mt-2 text-xs text-muted-foreground">{packedPct}% packed and counting</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Upcoming tasks</h3>
            <ul className="mt-4 space-y-3">
              {tasks.map((t) => (
                <li key={t.label} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.due}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Travel notes</h3>
            <label htmlFor="notes" className="sr-only">
              Travel notes
            </label>
            <textarea
              id="notes"
              rows={4}
              defaultValue="Book Oia sunset table for the 14th. Ferry tickets are cheaper booked two days ahead."
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
