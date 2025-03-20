import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "../../../../lib/prisma";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY as string);

export async function POST(request: Request) {
    try {
        // Get the token from the Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        try {
            // Verify the token first
            const { payload } = await jwtVerify(token, SECRET_KEY);

            // Calculate expiration time
            let expiresAt;
            if (payload.exp) {
                expiresAt = new Date(payload.exp * 1000);
            } else {
                // If no expiration in token, set default (1 hour)
                expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 1);
            }

            // Add the token to the revoked tokens list
            await prisma.revokedToken.create({
                data: {
                    token,
                    expiresAt,
                },
            });

            return NextResponse.json(
                { message: "Logged out successfully" },
                { status: 200 }
            );
        } catch {
            // Token verification failed, but we'll still consider it a successful logout
            return NextResponse.json(
                { message: "Logged out successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "An error occurred during logout" },
            { status: 500 }
        );
    }
}
