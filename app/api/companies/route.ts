import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}
