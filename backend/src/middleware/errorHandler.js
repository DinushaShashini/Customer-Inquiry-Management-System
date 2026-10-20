export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "An unexpected error occurred.";

  if (process.env.NODE_ENV !== "test" && statusCode === 500) {
    console.error("Unhandled Error:", err);
  }

  res.status(statusCode).json({
    status,
    message,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}
