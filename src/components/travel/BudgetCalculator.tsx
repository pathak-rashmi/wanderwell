import { useMemo } from "react";
import {
  Bus,
  Gift,
  Hotel,
  LifeBuoy,
  Plane,
  ShoppingBag,
  Ticket,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { budgetCategories } from "@/lib/travel-data";
import { Progress } from "@/components/ui/progress";
import { Reveal, Section, SectionHeader } from "./Section";
import { useTrip } from "@/contexts/TripContext";

const icons: Record<string, typeof Plane> = {
  flights: Plane,
  hotels: Hotel,
  food: UtensilsCrossed,
  transport: Bus,
  activities: Ticket,
  shopping: ShoppingBag,
  emergency: LifeBuoy,
};

export function BudgetCalculator() {
  const { budgets, updateBudgetValue, tripParams, itinerary } = useTrip();

  const targetBudget = Number(tripParams.budget) || 4500;

  const total = useMemo(() => {
    return Object.values(budgets).reduce((a, b) => a + b, 0);
  }, [budgets]);

  const remaining = targetBudget - total;
  const usedPct = Math.min((total / targetBudget) * 100, 100);
  const maxVal = Math.max(...Object.values(budgets), 1);

  // Find biggest cost category label
  const biggestCategory = useMemo(() => {
    let topId = "hotels";
    let topVal = -1;
    for (const [catId, val] of Object.entries(budgets)) {
      if (val > topVal) {
        topVal = val;
        topId = catId;
      }
    }
    const found = budgetCategories.find((c) => c.id === topId);
    return found ? found.label.toLowerCase() : topId;
  }, [budgets]);

  return (
    <Section id="budget" className="gradient-aurora">
      <SectionHeader
        eyebrow="Budget"
        title="Know exactly what your trip costs"
        description="Adjust any category and watch the totals, breakdown, and remaining trip budget update live."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Reveal className="grid gap-4 sm:grid-cols-2">
          {budgetCategories.map((c) => {
            const Icon = icons[c.id] ?? Wallet;
            const currentVal = budgets[c.id] ?? c.value;
            return (
              <div
                key={c.id}
                className="card-lift rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <label
                    htmlFor={`budget-${c.id}`}
                    className="min-w-0 truncate text-sm font-semibold"
                  >
                    {c.label}
                  </label>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background px-3">
                  <span className="text-muted-foreground">$</span>
                  <input
                    id={`budget-${c.id}`}
                    type="number"
                    min={0}
                    value={currentVal}
                    onChange={(e) =>
                      updateBudgetValue(c.id, Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full bg-transparent py-2.5 font-display text-lg font-semibold outline-none"
                  />
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <div className="glass rounded-3xl p-6 shadow-lift">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">Calculated total</span>
              <span className="font-display text-3xl font-bold">${total.toLocaleString()}</span>
            </div>
            <Progress value={usedPct} className="mt-4 h-3 rounded-full" />
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                {usedPct.toFixed(0)}% of ${targetBudget.toLocaleString()} plan
              </span>
              <span
                className={
                  remaining >= 0 ? "font-semibold text-emerald" : "font-semibold text-destructive"
                }
              >
                {remaining >= 0
                  ? `$${remaining.toLocaleString()} remaining`
                  : `$${Math.abs(remaining).toLocaleString()} over budget`}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Expense breakdown</h3>
            <ul className="mt-5 space-y-3">
              {budgetCategories.map((c) => {
                const v = budgets[c.id] ?? 0;
                return (
                  <li key={c.id} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3">
                    <span className="truncate text-xs text-muted-foreground">{c.label}</span>
                    <span className="h-2.5 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="gradient-brand block h-full rounded-full transition-all duration-700"
                        style={{ width: `${(v / maxVal) * 100}%` }}
                      />
                    </span>
                    <span className="text-xs font-semibold tabular-nums">${v}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="gradient-brand rounded-3xl p-6 text-primary-foreground shadow-glow">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" aria-hidden />
              <h3 className="font-display text-lg font-semibold">Budget Summary</h3>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Trip to {tripParams.destination}. Highest estimated expenditure is {biggestCategory}.
              {itinerary ? " AI budget calculations synced." : " Custom budget calculated."}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
