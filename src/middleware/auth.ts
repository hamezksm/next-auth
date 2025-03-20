import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import prisma from "../lib/prisma";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY as string);

export async function auth(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }

    const token = authHeader.split(" ")[1];

    try {
        // Check if token is revoked
        const revokedToken = await prisma.revokedToken.findUnique({
            where: { token },
        });

        if (revokedToken) {
            return false;
        }

        // Verify the token
        const { payload } = await jwtVerify(token, SECRET_KEY);

        return !!payload;
    } catch {
        return false;
    }
}
