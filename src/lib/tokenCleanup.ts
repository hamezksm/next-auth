import prisma from "./prisma";

export async function cleanupExpiredTokens() {
  try {
    const now = new Date();
    
    await prisma.revokedToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    
    console.log("Expired tokens cleaned up");
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
  }
}

// You can run this function periodically in a server context
// For example, in a Next.js API route that's triggered by a cron job