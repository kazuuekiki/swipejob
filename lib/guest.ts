// Default guest student/company profile for testing without login.
// Profile IDs are resolved lazily from the DB so this keeps working even
// after reseeds that reassign auto-increment IDs.
import { prisma } from "@/lib/prisma";

let cachedStudentId: number | null = null;
let cachedCompanyId: number | null = null;

async function resolveGuestStudentId(): Promise<number> {
  if (cachedStudentId !== null) return cachedStudentId;
  const s = await prisma.studentProfile.findFirst({ orderBy: { id: "asc" } });
  if (!s) throw new Error("No guest student profile available");
  cachedStudentId = s.id;
  return s.id;
}

async function resolveGuestCompanyId(): Promise<number> {
  if (cachedCompanyId !== null) return cachedCompanyId;
  const c = await prisma.company.findFirst({ orderBy: { id: "asc" } });
  if (!c) throw new Error("No guest company profile available");
  cachedCompanyId = c.id;
  return c.id;
}

export async function getProfile(session: any, forceRole?: "student" | "company") {
  if (session?.user) {
    return {
      role: (session.user as any).role as string,
      profileId: (session.user as any).profileId as number,
      userId: session.user.id as string,
    };
  }
  if (forceRole === "company") {
    const profileId = await resolveGuestCompanyId();
    return { role: "company", profileId, userId: "guest-company" };
  }
  const profileId = await resolveGuestStudentId();
  return { role: "student", profileId, userId: "guest-student" };
}
