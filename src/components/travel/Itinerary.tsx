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
  Sparkles,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { initialItinerary, type ActivityKind } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";
import { useTrip } from "@/contexts/TripContext";

const kindIcon: Record<ActivityKind, typeof Coffee> = {
  breakfast: Coffee,
  sightseeing: Camera,
  transport: Bus,
  hotel: Hotel,
  dinner: UtensilsCrossed,
  shopping: ShoppingBag,
};

export function Itinerary() {
  const { itinerary, updateActivity, addActivity, deleteActivity } = useTrip();

  // Local fallback state if no itinerary is generated
  const [localDays, setLocalDays] = useState(initialItinerary);
  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const [activeLocalDay, setActiveLocalDay] = useState<string>("Day 1");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);

  const [draftText, setDraftText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const hasItinerary = Boolean(itinerary && itinerary.days && itinerary.days.length > 0);

  // Get active day data
  const currentPlanDay = hasItinerary
    ? itinerary?.days.find((d) => d.day === activeDayNum) || itinerary?.days[0]
    : null;

  const currentLocalList = localDays[activeLocalDay] || [];

  return (
    <Section id="itinerary">
      <SectionHeader
        eyebrow="Itinerary"
        title={
          hasItinerary
            ? `${itinerary?.destination} Day-by-Day Timeline`
            : "Build your day, hour by hour"
        }
        description={
          hasItinerary
            ? itinerary?.summary || "Generated itinerary with cost breakdowns and daily timeline."
            : "Add, edit, reorder and delete activities on a clean timeline."
        }
      />

      <Reveal className="mt-12">
        {/* Banner if trip plan is active */}
        {hasItinerary && (
          <div className="gradient-brand mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-primary-foreground shadow-glow">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Trip Plan for {itinerary?.destination}</span>
            </div>
            {itinerary?.tips && itinerary.tips.length > 0 ? (
              <p className="text-xs opacity-90">💡 Tip: {itinerary.tips[0]}</p>
            ) : null}
          </div>
        )}

        {/* Day Selection Tabs */}
        <div className="flex flex-wrap gap-2">
          {hasItinerary
            ? itinerary?.days.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setActiveDayNum(d.day)}
                  aria-current={activeDayNum === d.day}
                  className={cn(
                    "ripple rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all",
                    activeDayNum === d.day
                      ? "gradient-brand text-primary-foreground shadow-glow"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  Day {d.day}
                </button>
              ))
            : Object.keys(localDays).map((dayKey) => (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => setActiveLocalDay(dayKey)}
                  aria-current={activeLocalDay === dayKey}
                  className={cn(
                    "ripple rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all",
                    activeLocalDay === dayKey
                      ? "gradient-brand text-primary-foreground shadow-glow"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {dayKey}
                </button>
              ))}
        </div>

        {hasItinerary && currentPlanDay?.title ? (
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            {currentPlanDay.title}
          </h3>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Timeline List */}
          <ol className="relative space-y-3 border-l border-dashed border-border pl-6">
            {hasItinerary && currentPlanDay
              ? currentPlanDay.activities.map((act, actIdx) => {
                  const isEditing = editingIndex === actIdx;
                  return (
                    <li
                      key={`${currentPlanDay.day}-${actIdx}`}
                      className="group relative rounded-3xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:shadow-lift"
                    >
                      <span className="gradient-brand absolute top-6 -left-[1.9rem] grid h-8 w-8 place-items-center rounded-full text-primary-foreground shadow-glow">
                        <Camera className="h-4 w-4" aria-hidden />
                      </span>

                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                        <GripVertical
                          className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary">{act.time}</span>
                            {act.estimatedCost ? (
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                Est. ${act.estimatedCost}
                              </span>
                            ) : null}
                          </div>

                          {isEditing ? (
                            <input
                              value={draftText}
                              autoFocus
                              onChange={(e) => setDraftText(e.target.value)}
                              aria-label="Edit activity"
                              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none"
                            />
                          ) : (
                            <div>
                              <p className="font-semibold text-sm text-foreground">{act.place || act.description}</p>
                              {act.description && act.description !== act.place ? (
                                <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                              ) : null}
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Save activity"
                                onClick={() => {
                                  updateActivity(currentPlanDay.day, actIdx, draftText || act.place);
                                  setEditingIndex(null);
                                }}
                              >
                                <Check className="h-4 w-4 text-emerald" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Cancel edit"
                                onClick={() => setEditingIndex(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label={`Edit ${act.place}`}
                                onClick={() => {
                                  setEditingIndex(actIdx);
                                  setDraftText(act.place || act.description);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label={`Delete ${act.place}`}
                                onClick={() => deleteActivity(currentPlanDay.day, actIdx)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              : currentLocalList.map((a) => {
                  const Icon = kindIcon[a.kind];
                  const isEditing = editingLocalId === a.id;
                  return (
                    <li
                      key={a.id}
                      className="group relative rounded-3xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:shadow-lift"
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
                          {isEditing ? (
                            <input
                              value={draftText}
                              autoFocus
                              onChange={(e) => setDraftText(e.target.value)}
                              aria-label="Edit activity"
                              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none"
                            />
                          ) : (
                            <p className="truncate text-sm font-medium">{a.title}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Save activity"
                                onClick={() => {
                                  setLocalDays((prev) => ({
                                    ...prev,
                                    [activeLocalDay]: currentLocalList.map((x) =>
                                      x.id === a.id ? { ...x, title: draftText || x.title } : x,
                                    ),
                                  }));
                                  setEditingLocalId(null);
                                }}
                              >
                                <Check className="h-4 w-4 text-emerald" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Cancel edit"
                                onClick={() => setEditingLocalId(null)}
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
                                  setEditingLocalId(a.id);
                                  setDraftText(a.title);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label={`Delete ${a.title}`}
                                onClick={() =>
                                  setLocalDays((prev) => ({
                                    ...prev,
                                    [activeLocalDay]: currentLocalList.filter((x) => x.id !== a.id),
                                  }))
                                }
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

            {hasItinerary && currentPlanDay?.activities.length === 0 ? (
              <li className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No activities planned yet for Day {currentPlanDay.day}.
              </li>
            ) : null}
          </ol>

          {/* Form to Add Activity */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTitle.trim()) return;
              if (hasItinerary && currentPlanDay) {
                addActivity(currentPlanDay.day, newTime, newTitle.trim(), newTitle.trim());
              } else {
                setLocalDays((prev) => ({
                  ...prev,
                  [activeLocalDay]: [
                    ...currentLocalList,
                    {
                      id: `${Date.now()}`,
                      time: newTime,
                      title: newTitle.trim(),
                      kind: "sightseeing",
                    },
                  ],
                }));
              }
              setNewTitle("");
            }}
            className="glass h-fit rounded-3xl p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">
              Add activity to {hasItinerary ? `Day ${activeDayNum}` : activeLocalDay}
            </h3>

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
              placeholder="e.g. Sunset boat tour, Museum visit"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
            />

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
