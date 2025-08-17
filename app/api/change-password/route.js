import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json( 
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();
    const email = session.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid current password" },
        { status: 401 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New password and confirm password do not match" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { message: "New password must be different from current password" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ 
      message: "An error occurred while changing the password. Please try again." 
    }, { status: 500 });
  }
}

