import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Build a stable connection string for Neon Postgres.
// Neon free-tier compute auto-suspends after ~5 min idle. The first query after
// suspend triggers a cold-start resume that can take 5 to 10 seconds. Without
// connect_timeout, the pg driver gives up early and surfaces "Connection
// terminated" 500s in local dev. We prefer POSTGRES_PRISMA_URL (Vercel-provided,
// already includes connect_timeout=15) and inject connect_timeout=15 if absent.
function buildConnectionString(): string {
  let cs =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!cs) {
    throw new Error(
      "Database connection string not found. Set POSTGRES_PRISMA_URL or DATABASE_URL."
    );
  }
  if (!/[?&]connect_timeout=/.test(cs)) {
    cs += (cs.includes("?") ? "&" : "?") + "connect_timeout=15";
  }
  return cs;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: buildConnectionString() });
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
