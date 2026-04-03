import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId, role } = getProfile(session);

  if (role === "student") {
    const matches = await prisma.match.findMany({
      where: { studentId: profileId },
      include: {
        application: { include: { company: { include: { profile: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(matches);
  } else if (role === "company") {
    const matches = await prisma.match.findMany({
      where: { companyId: profileId },
      include: {
        application: { include: { student: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(matches);
  }

  return NextResponse.json([]);
}
