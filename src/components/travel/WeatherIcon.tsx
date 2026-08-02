import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function WeatherIcon({
  kind,
  className,
}: {
  kind: "sun" | "cloud" | "rain" | "snow";
  className?: string;
}) {
  const props = { className: cn("h-5 w-5", className), "aria-hidden": true };
  if (kind === "sun") return <Sun {...props} />;
  if (kind === "cloud") return <Cloud {...props} />;
  if (kind === "rain") return <CloudRain {...props} />;
  return <Snowflake {...props} />;
}
