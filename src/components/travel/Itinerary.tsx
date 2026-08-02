import { useState } from "react";
import {
  Bus,
  Camera,
  Check,
  Coffee,
  GripVertical,
  Hotel,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { initialItinerary, type Activity, type ActivityKind } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

const kindIcon: Record<ActivityKind, typeof Coffee> = {
  breakfast: Coffee,
  sightseeing: Camera,
  transport: Bus,
  hotel: Hotel,
  dinner: UtensilsCrossed,
  shopping: ShoppingBag,
};

const kinds = Object.keys(kindIcon) as ActivityKind[];

export function Itinerary() {
  const [days, setDays] = useState(initialItinerary);
  const [active, setActive] = useState("Day 1");
  const [dragId, setDragId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [newKind, setNewKind] = useState<ActivityKind>("sightseeing");

  const list = days[active] ?? [];
  const update = (next: Activity[]) => setDays((d) => ({ ...d, [active]: next }));

  const reorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = list.findIndex((a) => a.id === dragId);
    const to = list.findIndex((a) => a.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    update(next);
  };

  return (
    <Section id="itinerary">
      <SectionHeader
        eyebrow="Itinerary"
        title="Build your day, hour by hour"
        description="Add, edit, reorder and delete activities on a clean timeline — drag the handle to reshuffle a day."
      />

      <Reveal className="mt-12">
        <div className="flex flex-wrap gap-2">
          {Object.keys(days).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActive(day)}
              aria-current={active === day}
              className={cn(
                "ripple rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all",
                active === day
                  ? "gradient-brand text-primary-foreground shadow-glow"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <ol className="relative space-y-3 border-l border-dashed border-border pl-6">
            {list.map((a) => {
              const Icon = kindIcon[a.kind];
              return (
                <li
                  key={a.id}
                  draggable
                  onDragStart={() => setDragId(a.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorder(a.id)}
                  onDragEnd={() => setDragId(null)}
                  className={cn(
                    "group relative rounded-3xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:shadow-lift",
                    dragId === a.id && "opacity-50",
                  )}
                >
                  <span className="gradient-brand absolute top-6 -left-[1.9rem] grid h-8 w-8 place-items-center rounded-full text-primary-foreground shadow-glow">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>

                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <GripVertical
                      className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-primary">{a.time}</div>
                      {editing === a.id ? (
                        <input
                          value={draft}
                          autoFocus
                          onChange={(e) => setDraft(e.target.value)}
                          aria-label="Edit activity"
                          className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none"
                        />
                      ) : (
                        <p className="truncate text-sm font-medium">{a.title}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {editing === a.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Save activity"
                            onClick={() => {
                              update(
                                list.map((x) =>
                                  x.id === a.id ? { ...x, title: draft || x.title } : x,
                                ),
                              );
                              setEditing(null);
                            }}
                          >
                            <Check className="h-4 w-4 text-emerald" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Cancel edit"
                            onClick={() => setEditing(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Edit ${a.title}`}
                            onClick={() => {
                              setEditing(a.id);
                              setDraft(a.title);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Delete ${a.title}`}
                            onClick={() => update(list.filter((x) => x.id !== a.id))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            {list.length === 0 ? (
              <li className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nothing planned yet for {active}.
              </li>
            ) : null}
          </ol>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTitle.trim()) return;
              update([
                ...list,
                {
                  id: `${Date.now()}`,
                  time: newTime,
                  title: newTitle.trim(),
                  kind: newKind,
                },
              ]);
              setNewTitle("");
            }}
            className="glass h-fit rounded-3xl p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Add activity to {active}</h3>

            <label htmlFor="act-time" className="mt-5 block text-xs font-medium">
              Time
            </label>
            <input
              id="act-time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
            />

            <label htmlFor="act-title" className="mt-4 block text-xs font-medium">
              What's planned?
            </label>
            <input
              id="act-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Sunset boat tour"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
            />

            <fieldset className="mt-4">
              <legend className="text-xs font-medium">Type</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {kinds.map((k) => {
                  const Icon = kindIcon[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNewKind(k)}
                      aria-pressed={newKind === k}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl border transition-all",
                        newKind === k
                          ? "gradient-brand border-transparent text-primary-foreground shadow-glow"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                      title={k}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      <span className="sr-only">{k}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Button
              type="submit"
              className="ripple gradient-brand mt-6 w-full rounded-2xl text-primary-foreground hover:opacity-95"
            >
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Add to timeline
            </Button>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}
