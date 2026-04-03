import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password, name, school, graduationYear, bio } = await req.json();

  if (!email || !password || !name || !school || !graduationYear) {
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
      role: "student",
      studentProfile: {
        create: {
          name,
          school,
          graduationYear: Number(graduationYear),
          bio: bio || "",
        },
      },
    },
    include: { studentProfile: true },
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
