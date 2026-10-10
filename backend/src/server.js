import { app } from './app.js';
import { env } from './config/env.js';
import { ping } from './config/database.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    const isDbConnected = await ping();
    if (!isDbConnected) {
      logger.warn('MySQL ping failed. Server starting, but DB operations may fail.');
    } else {
      logger.info('MySQL database connection established.');
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`LazyForge API server is running on http://localhost:${env.PORT}`);
    });

    const gracefulShutdown = () => {
      logger.info('Gracefully shutting down LazyForge API server...');
      server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

startServer();
