import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "../config/env.js";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { errorHandler, notFound } from "../middleware/errorMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import packingRoutes from "../routes/packingRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import tripRoutes from "../routes/tripRoutes.js";
import travelRoutes from "../routes/travelRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/", authRoutes);
app.use("/api", profileRoutes);
app.use("/", profileRoutes);
app.use("/api", travelRoutes);
app.use("/", travelRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip", tripRoutes);
app.use("/trip", tripRoutes);
app.use("/api/packing", packingRoutes);
app.use(notFound);
app.use(errorHandler);

const server = await connectDatabase().then(() =>
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  }),
);

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));