import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <Section id="stories" className="gradient-aurora">
      <SectionHeader eyebrow="Stories" title="Travellers who stopped juggling tabs" />

      <Reveal className="mt-12">
        <div className="mx-auto max-w-3xl">
          <div className="glass overflow-hidden rounded-3xl p-8 shadow-lift sm:p-12">
            <Quote className="h-8 w-8 text-primary" aria-hidden />
            <div
              className="mt-6 flex transition-transform duration-700"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <blockquote key={t.name} className="w-full shrink-0 pr-8">
                  <p className="font-display text-lg leading-relaxed text-pretty sm:text-xl">
                    “{t.quote}”
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <span className="gradient-brand grid h-11 w-11 shrink-0 place-items-center rounded-full font-display font-bold text-primary-foreground">
                      {t.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{t.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{t.trip}</div>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              aria-label="Previous story"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Go to story ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    i === index ? "w-8 bg-primary" : "w-2 bg-border",
                  )}
                />
              ))}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              aria-label="Next story"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
