import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const messages = await prisma.message.findMany({
    where: { matchId: Number(matchId) },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { profileId, role } = getProfile(session, "student");

  const { matchId } = await params;
  const { body } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      matchId: Number(matchId),
      senderId: profileId,
      senderRole: role,
      body: body.trim(),
    },
  });

  return NextResponse.json(message);
}
