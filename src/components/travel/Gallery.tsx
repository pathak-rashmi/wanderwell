import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { destinations } from "@/lib/travel-data";
import { Reveal, Section, SectionHeader } from "./Section";

const spans = [
  "sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "",
  "",
];

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const current = active !== null ? destinations[active] : null;

  return (
    <Section id="gallery">
      <SectionHeader
        eyebrow="Gallery"
        title="Moments worth planning for"
        description="Photos from trips built with Travel Planner. Click any frame to open it full size."
      />

      <Reveal className="mt-12">
        <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-3xl shadow-soft ${spans[i] ?? ""}`}
              aria-label={`Open photo of ${d.name}`}
            >
              <img
                src={d.image}
                alt={`${d.name}, ${d.country}`}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
              />
              <span className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/35" />
              <span className="glass absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5" aria-hidden />
              </span>
              <span className="absolute bottom-4 left-4 font-display text-sm font-semibold text-primary-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {d.name}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo of ${current.name}`}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[70] grid place-items-center bg-foreground/80 p-4 backdrop-blur-md animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close photo"
            className="glass absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-w-4xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.image}
              alt={`${current.name}, ${current.country}`}
              width={800}
              height={600}
              className="max-h-[75vh] w-full rounded-3xl object-cover shadow-lift"
            />
            <figcaption className="mt-4 text-center font-display text-lg font-semibold text-primary-foreground">
              {current.name}, {current.country}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </Section>
  );
}
