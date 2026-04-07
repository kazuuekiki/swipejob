import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId } = await getProfile(session, "student");

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const count = await prisma.application.count({
    where: { studentId: profileId, createdAt: { gte: since } },
  });

  return NextResponse.json({ remaining: Math.max(0, 5 - count), used: count });
}
