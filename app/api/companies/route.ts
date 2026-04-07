import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      companyName: true,
      profile: {
        select: {
          catchphrase: true,
          location: true,
          employeeCount: true,
          industry: true,
          culture: true,
          salary: true,
          annualSalary: true,
          logoColor: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}
