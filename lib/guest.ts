// Default guest student profile for testing without login
// Uses the first seeded student (山田 太郎, userId=11, studentProfileId=1)
export const GUEST_STUDENT = {
  userId: "11",
  role: "student" as const,
  profileId: 1,
};

// Default guest company for testing without login
// Uses the first seeded company (テックビジョン, userId=1, companyId=1)
export const GUEST_COMPANY = {
  userId: "1",
  role: "company" as const,
  profileId: 1,
};

export function getProfile(session: any, forceRole?: "student" | "company") {
  if (session?.user) {
    return {
      role: (session.user as any).role as string,
      profileId: (session.user as any).profileId as number,
      userId: session.user.id as string,
    };
  }
  // Guest fallback
  const guest = forceRole === "company" ? GUEST_COMPANY : GUEST_STUDENT;
  return {
    role: guest.role,
    profileId: guest.profileId,
    userId: guest.userId,
  };
}
