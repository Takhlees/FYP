import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password, confirmPassword } = await req.json();
      
        if (!email || !password || !confirmPassword) {
            return new NextResponse(
                JSON.stringify({ error: "Email, password, and confirm password are required" }), 
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return new NextResponse(
                JSON.stringify({ error: "Passwords do not match" }), 
                { status: 400 }
            );
        }

        // Validate password format
        const validatePassword = (password) => {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isLongEnough = password.length >= 8;

            return (
                hasUpperCase &&
                hasLowerCase &&
                hasNumbers &&
                hasSpecialChar &&
                isLongEnough
            );
        };

        if (!validatePassword(password)) {
            return new NextResponse(
                JSON.stringify({ 
                    error: "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters" 
                }), 
                { status: 400 }
            );
        }

        await connectToDB();

        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            return new NextResponse(
                JSON.stringify({ error: "User with this email doesn't exist" }), 
                { status: 404 }
            );
        }

        if (!existingUser.resetToken || !existingUser.resetTokenExpiry) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid reset session. Please request a new reset link." }), 
                { status: 400 }
            );
        }

        if (existingUser.resetTokenExpiry < Date.now()) {
            return new NextResponse(
                JSON.stringify({ error: "Reset session has expired. Please request a new reset link." }), 
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        existingUser.password = hashedPassword;
        existingUser.resetToken = undefined;
        existingUser.resetTokenExpiry = undefined;

        await existingUser.save();
        
        return new NextResponse(
            JSON.stringify({ message: "Password updated successfully!" }), 
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Reset password error:", error);
        return new NextResponse(
            JSON.stringify({ error: "An unexpected error occurred" }), 
            { status: 500 }
        );
    }
}