import { app } from './app';
import { AppConfig } from './core/config/server.config';
import logger from './core/utils/logger';
import { Server } from 'http';

async function shutdown(server: Server) {
  console.log("🔻 Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Closed remaining connections");
    process.exit(0);
  });

  // Force exit if not closed in X sec
  setTimeout(() => process.exit(1), 10000);
}

async function main() {
  try {
    const server = app.listen(AppConfig.port, () => {
      console.log(`[server] => http://localhost:${AppConfig.port}`);
    });

    server.on('error', (err) => {
      logger.error('Server error:', err.message);
      process.exit(1);
    });

    process.on("SIGTERM", () => shutdown(server));
    process.on("SIGINT", () => shutdown(server));
  } catch (err) {
    logger.error('Failed to start server:', err);
    console.log(err)
    process.exit(1);
  }
}

main();