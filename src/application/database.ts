import { PrismaClient } from '@prisma/client'
import { logger } from './logging'

/**
 * Prisma Client instance for database operations.
 * This client is configured to log query, error, info, and warn events.
 * It also sets up listeners to log these events using the application's logger.
 */
export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

// Log Prisma events to the logger
prismaClient.$on('query', (e: any) => {
  logger.info(e)
})

prismaClient.$on('error', (e: any) => {
  logger.error(e)
})

prismaClient.$on('info', (e: any) => {
  logger.info(e)
})

prismaClient.$on('warn', (e: any) => {
  logger.warn(e)
})
