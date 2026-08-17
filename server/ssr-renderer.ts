import { fetchViteEnv } from "nitro/vite/runtime";

type NitroEvent = {
  req: Request;
};

// TanStack Start builds the SSR app as Nitro's "ssr" Vite service. Forwarding
// requests here avoids Nitro's static index.html fallback, which cannot render
// TanStack's full-document SSR response.
export default function renderTanStackApp({ req }: NitroEvent) {
  return fetchViteEnv("ssr", req);
}
