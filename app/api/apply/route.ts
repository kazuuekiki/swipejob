import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "応募にはログインが必要です", requiresAuth: true },
      { status: 401 }
    );
  }
  const { profileId } = await getProfile(session, "student");
  const { companyId, message } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "企業IDが必要です" }, { status: 400 });
  }

  // プロフィール必須項目チェック
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: profileId },
  });
  if (!studentProfile || !studentProfile.name || !studentProfile.birthDate || !studentProfile.bio || !studentProfile.selfPr) {
    return NextResponse.json(
      { error: "応募にはプロフィールの必須項目（氏名・生年月日・自己紹介・自己PR）を入力してください", incomplete: true },
      { status: 400 }
    );
  }

  // 24時間以内の応募数チェック
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.application.count({
    where: {
      studentId: profileId,
      createdAt: { gte: since },
    },
  });

  if (recentCount >= 5) {
    return NextResponse.json(
      { error: "24時間以内の応募数が上限（5件）に達しています" },
      { status: 429 }
    );
  }

  // 既に応募済みチェック
  const existing = await prisma.application.findUnique({
    where: { studentId_companyId: { studentId: profileId, companyId: Number(companyId) } },
  });
  if (existing) {
    return NextResponse.json({ error: "既に応募済みです" }, { status: 400 });
  }

  const application = await prisma.application.create({
    data: {
      studentId: profileId,
      companyId: Number(companyId),
      message: message || "",
      status: "applied",
    },
  });

  return NextResponse.json({ application, remaining: 4 - recentCount });
}
