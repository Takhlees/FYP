
import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
    //api for reset password and add new password to DB
    // Parse request
    const { email, password } = await req.json();
    await connectToDB();

    const existingUser = await User.findOne({ email});


    const hashedpassword = await bcrypt.hash(password, 5)
    existingUser.password = hashedpassword;

    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;

    try {
        await existingUser.save();
        return new NextResponse(JSON.stringify("user password is updated successfully!"), { status:200})
        
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status:500})
        
    }

}