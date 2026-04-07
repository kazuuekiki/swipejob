import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/guest";

export async function GET() {
  const session = await getServerSession(authOptions);
  const { profileId } = await getProfile(session, "student");
  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId },
  });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { profileId } = await getProfile(session, "student");
  const data = await req.json();

  // Only allow updating these fields
  const allowed = [
    "name", "birthDate", "school", "graduationYear", "graduationMonth",
    "educationType", "faculty", "location", "bio", "selfPr",
    "desiredIndustry", "desiredJob", "desiredLocation",
    "skills", "qualifications", "internship",
    "mbti", "photoUrl", "resumeUrl",
  ];

  const updateData: Record<string, any> = {};
  for (const key of allowed) {
    if (key in data) {
      if (key === "graduationYear" || key === "graduationMonth") {
        updateData[key] = Number(data[key]);
      } else {
        updateData[key] = data[key];
      }
    }
  }

  const updated = await prisma.studentProfile.update({
    where: { id: profileId },
    data: updateData,
  });

  return NextResponse.json(updated);
}
