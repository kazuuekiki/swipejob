import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId, role } = getProfile(session, "student");

  if (role === "student") {
    const applications = await prisma.application.findMany({
      where: { studentId: profileId },
      include: { company: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } else if (role === "company") {
    const applications = await prisma.application.findMany({
      where: { companyId: profileId },
      include: { student: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  }

  return NextResponse.json([]);
}
