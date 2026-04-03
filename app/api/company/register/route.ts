import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password, companyName, description, industry, location, employeeCount, salary, catchphrase, foundedYear, workStyle } = await req.json();

  if (!email || !password || !companyName) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "このメールアドレスは既に使用されています" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "company",
      company: {
        create: {
          companyName,
          email,
          profile: {
            create: {
              description: description || "",
              industry: industry || "",
              location: location || "",
              employeeCount: employeeCount || "",
              salary: salary || "",
              catchphrase: catchphrase || "",
              foundedYear: foundedYear || "",
              workStyle: workStyle || "",
            },
          },
        },
      },
    },
    include: { company: { include: { profile: true } } },
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
