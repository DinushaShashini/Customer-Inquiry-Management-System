import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`[backend]: Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log("\nReceived kill signal, shutting down gracefully...");
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
