import { useState } from "react";
import { Backpack, Plus, Shirt, Laptop, FileText, Pill, Droplets, Watch } from "lucide-react";
import type { PackCategory } from "@/lib/travel-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";

const icons: Record<string, typeof Shirt> = {
  clothing: Shirt,
  electronics: Laptop,
  documents: FileText,
  medicines: Pill,
  toiletries: Droplets,
  accessories: Watch,
};

export function Packing({
  categories,
  setCategories,
}: {
  categories: PackCategory[];
  setCategories: React.Dispatch<React.SetStateAction<PackCategory[]>>;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const toggle = (catId: string, itemId: string) =>
    setCategories((cats) =>
      cats.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)),
            }
          : c,
      ),
    );

  const addItem = (catId: string) => {
    const label = (drafts[catId] ?? "").trim();
    if (!label) return;
    setCategories((cats) =>
      cats.map((c) =>
        c.id === catId
          ? { ...c, items: [...c.items, { id: `${Date.now()}`, label, done: false }] }
          : c,
      ),
    );
    setDrafts((d) => ({ ...d, [catId]: "" }));
  };

  const allItems = categories.flatMap((c) => c.items);
  const overall = allItems.length
    ? Math.round((allItems.filter((i) => i.done).length / allItems.length) * 100)
    : 0;

  return (
    <Section id="packing" className="gradient-aurora">
      <SectionHeader
        eyebrow="Packing"
        title="Nothing forgotten, nothing overpacked"
        description={`Your bag is ${overall}% packed. Tick items off and add your own to any category.`}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, idx) => {
          const Icon = icons[c.id] ?? Backpack;
          const done = c.items.filter((i) => i.done).length;
          const pct = c.items.length ? Math.round((done / c.items.length) * 100) : 0;
          return (
            <Reveal key={c.id} delay={idx * 60}>
              <div className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="truncate font-display font-semibold">{c.label}</h3>
                  <span className="shrink-0 text-sm font-bold text-emerald">{pct}%</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-emerald transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <ul className="mt-4 flex-1 space-y-2.5">
                  {c.items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`${c.id}-${i.id}`}
                        checked={i.done}
                        onCheckedChange={() => toggle(c.id, i.id)}
                      />
                      <label
                        htmlFor={`${c.id}-${i.id}`}
                        className={
                          i.done
                            ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
                            : "min-w-0 flex-1 truncate text-sm"
                        }
                      >
                        {i.label}
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <label htmlFor={`add-${c.id}`} className="sr-only">
                    Add item to {c.label}
                  </label>
                  <input
                    id={`add-${c.id}`}
                    value={drafts[c.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(c.id);
                      }
                    }}
                    placeholder="Add custom item"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                  />
                  <Button
                    size="icon"
                    aria-label={`Add item to ${c.label}`}
                    onClick={() => addItem(c.id)}
                    className="gradient-brand shrink-0 rounded-xl text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
