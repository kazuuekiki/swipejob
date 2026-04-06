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
      select: {
        id: true,
        createdAt: true,
        application: {
          select: {
            company: {
              select: {
                companyName: true,
                profile: {
                  select: { catchphrase: true, industry: true, logoColor: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(matches);
  } else if (role === "company") {
    const matches = await prisma.match.findMany({
      where: { companyId: profileId },
      select: {
        id: true,
        createdAt: true,
        application: {
          select: {
            student: {
              select: { id: true, name: true, school: true, bio: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(matches);
  }

  return NextResponse.json([]);
}
