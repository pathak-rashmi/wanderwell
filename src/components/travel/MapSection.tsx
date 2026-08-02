import { Building2, Hotel, Landmark, Palmtree, Plane, TreePine, UtensilsCrossed } from "lucide-react";
import mapImage from "@/assets/map.jpg";
import { Reveal, Section, SectionHeader } from "./Section";

const pins = [
  { icon: Plane, label: "Airport", x: 18, y: 26 },
  { icon: Hotel, label: "Hotel", x: 42, y: 44 },
  { icon: Landmark, label: "Museum", x: 58, y: 30 },
  { icon: UtensilsCrossed, label: "Restaurant", x: 66, y: 58 },
  { icon: Palmtree, label: "Beach", x: 30, y: 70 },
  { icon: TreePine, label: "Park", x: 80, y: 42 },
];

export function MapSection() {
  return (
    <Section id="map">
      <SectionHeader
        eyebrow="Map"
        title="See your trip laid out on the ground"
        description="Every saved place pinned on one illustrated map so you can plan routes that make sense."
      />

      <Reveal className="mt-12">
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-lift">
          <img
            src={mapImage}
            alt="Illustrated map of the destination city with parks, streets and coastline"
            loading="lazy"
            width={1400}
            height={900}
            className="h-[26rem] w-full object-cover sm:h-[34rem]"
          />
          {pins.map((p, i) => (
            <button
              key={p.label}
              type="button"
              style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 400}ms` }}
              className="float-slow group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="gradient-brand grid h-11 w-11 place-items-center rounded-full text-primary-foreground shadow-glow transition-transform group-hover:scale-115">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="glass pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {p.label}
              </span>
            </button>
          ))}
          <div className="glass absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-soft">
            <Building2 className="h-4 w-4 text-primary" aria-hidden />6 saved places
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
