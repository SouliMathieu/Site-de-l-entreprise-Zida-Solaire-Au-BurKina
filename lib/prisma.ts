// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Supabase Transaction Pooler (port 6543) does not support prepared statements.
// A serverless Prisma runtime should also keep its own connection pool small.
// Prisma Migrate continues to use DIRECT_URL (port 5432) from schema.prisma.
function runtimeDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.hostname.endsWith(".pooler.supabase.com") && url.port === "6543") {
      url.searchParams.set("pgbouncer", "true");
      url.searchParams.set("connection_limit", "1");
      return url.toString();
    }
  } catch {
    // Preserve the original value so Prisma reports invalid URL configuration.
  }

  return raw;
}

const pooledUrl = runtimeDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(pooledUrl ? { datasources: { db: { url: pooledUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Share one Prisma client per Node.js runtime, including production.
globalForPrisma.prisma = prisma;
