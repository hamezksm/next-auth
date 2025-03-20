import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
