import { useMemo } from "react";
import { CalendarDays, CheckCircle2, MapPin, NotebookPen, Timer, Wallet } from "lucide-react";
import type { PackCategory } from "@/lib/travel-data";
import { useCountdown } from "@/hooks/use-travel";
import { Progress } from "@/components/ui/progress";
import { Reveal, Section, SectionHeader } from "./Section";
import { useTrip } from "@/contexts/TripContext";

const tasks = [
  { label: "Confirm airport transfer", due: "in 2 days" },
  { label: "Download offline maps", due: "in 4 days" },
  { label: "Exchange local cash", due: "in 5 days" },
  { label: "Check-in online", due: "in 9 days" },
];

export function Dashboard({ packing }: { packing: PackCategory[] }) {
  const { tripParams, selectedDestination, itinerary, budgets, totalBudgetCost } = useTrip();

  const tripDate = useMemo(() => {
    if (tripParams.startDate) {
      const d = new Date(tripParams.startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  }, [tripParams.startDate]);

  const { days, hours, minutes, seconds } = useCountdown(tripDate);

  const items = packing.flatMap((c) => c.items);
  const packedPct = items.length
    ? Math.round((items.filter((i) => i.done).length / items.length) * 100)
    : 0;

  const totalActivitiesCount = useMemo(() => {
    if (!itinerary || !itinerary.days) return 10;
    return itinerary.days.reduce((acc, curr) => acc + (curr.activities ? curr.activities.length : 0), 0);
  }, [itinerary]);

  const durationDays = useMemo(() => {
    if (itinerary && itinerary.days) return itinerary.days.length;
    if (tripParams.startDate && tripParams.endDate) {
      const s = new Date(tripParams.startDate);
      const e = new Date(tripParams.endDate);
      const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
      return isNaN(diff) ? 6 : diff;
    }
    return 6;
  }, [itinerary, tripParams]);

  const expensesList = [
    { label: "Flights", value: budgets["flights"] || 0 },
    { label: "Hotels", value: budgets["hotels"] || 0 },
    { label: "Food", value: budgets["food"] || 0 },
    { label: "Transport", value: budgets["transport"] || 0 },
    { label: "Activities", value: budgets["activities"] || 0 },
    { label: "Shopping", value: budgets["shopping"] || 0 },
  ];

  const maxVal = Math.max(...expensesList.map((e) => e.value), 1);

  const stats = [
    { icon: MapPin, label: "Destination", value: selectedDestination.name || tripParams.destination },
    { icon: CalendarDays, label: "Days remaining", value: `${days}` },
    { icon: Wallet, label: "Budget planned", value: `$${totalBudgetCost.toLocaleString()}` },
    { icon: CheckCircle2, label: "Packing progress", value: `${packedPct}%` },
    { icon: NotebookPen, label: "Activities planned", value: `${totalActivitiesCount}` },
    { icon: Timer, label: "Trip duration", value: `${durationDays} days` },
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
                <div className="mt-4 font-display text-2xl font-bold truncate">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">Expenses Breakdown</h3>
              <span className="text-sm text-muted-foreground">
                ${totalBudgetCost.toLocaleString()} tracked
              </span>
            </div>
            <div className="mt-6 flex h-52 items-stretch gap-3">
              {expensesList.map((e) => (
                <div
                  key={e.label}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-semibold tabular-nums">${e.value}</span>
                  <div className="flex h-full w-full items-end">
                    <span
                      className="gradient-brand w-full rounded-t-xl transition-all duration-700"
                      style={{ height: `${(e.value / maxVal) * 100}%` }}
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
              defaultValue={`Planning ${durationDays}-day trip to ${selectedDestination.name || tripParams.destination}. Save tickets and passport scans in your mobile wallet.`}
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
