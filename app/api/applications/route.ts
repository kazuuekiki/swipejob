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
      select: {
        id: true,
        status: true,
        message: true,
        createdAt: true,
        company: {
          select: {
            companyName: true,
            profile: {
              select: { catchphrase: true, industry: true, logoColor: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } else if (role === "company") {
    const applications = await prisma.application.findMany({
      where: { companyId: profileId },
      select: {
        id: true,
        status: true,
        message: true,
        createdAt: true,
        student: {
          select: { id: true, name: true, school: true, bio: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  }

  return NextResponse.json([]);
}
