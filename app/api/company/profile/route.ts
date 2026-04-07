import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId: companyId } = await getProfile(session, "company");
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { profile: true },
  });
  return NextResponse.json(company);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { profileId: companyId } = await getProfile(session, "company");
  const data = await req.json();

  await prisma.companyProfile.upsert({
    where: { companyId },
    update: data,
    create: { companyId, ...data },
  });

  return NextResponse.json({ success: true });
}
