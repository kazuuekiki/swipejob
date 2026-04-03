import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId } = getProfile(session, "student");
  const favorites = await prisma.favorite.findMany({
    where: { studentId: profileId },
    include: { company: { include: { profile: true } } },
  });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { profileId } = getProfile(session, "student");
  const { companyId } = await req.json();

  const existing = await prisma.favorite.findUnique({
    where: { studentId_companyId: { studentId: profileId, companyId: Number(companyId) } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { studentId: profileId, companyId: Number(companyId) },
  });
  return NextResponse.json({ favorited: true });
}
