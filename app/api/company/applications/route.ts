import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId } = await getProfile(session, "company");
  const applications = await prisma.application.findMany({
    where: { companyId: profileId },
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { profileId: companyId } = await getProfile(session, "company");
  const { applicationId, action } = await req.json();

  const application = await prisma.application.findUnique({
    where: { id: Number(applicationId) },
  });
  if (!application || application.companyId !== companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "approve") {
    await prisma.application.update({
      where: { id: application.id },
      data: { status: "matched" },
    });

    const existingMatch = await prisma.match.findUnique({
      where: { studentId_companyId: { studentId: application.studentId, companyId: application.companyId } },
    });

    if (!existingMatch) {
      await prisma.match.create({
        data: {
          studentId: application.studentId,
          companyId: application.companyId,
          applicationId: application.id,
        },
      });
    }
  } else if (action === "reject") {
    await prisma.application.update({
      where: { id: application.id },
      data: { status: "rejected" },
    });
  }

  return NextResponse.json({ success: true });
}
