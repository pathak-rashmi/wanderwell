import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({ message: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  const statusCode = typeof error === "object" && error !== null && "statusCode" in error
    ? Number(error.statusCode)
    : 500;
  response.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    message: statusCode === 500 ? "Internal server error" : String(error.message ?? error),
  });
};