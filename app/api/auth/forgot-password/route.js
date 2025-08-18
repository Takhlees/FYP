import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Mailgun from "mailgun.js";
import formData from "form-data";
import crypto from "crypto";
import { createPasswordResetTemplate } from "@utils/emailTemplates";
 
export async function POST(req) {
  try {
    // Parse request
    const { email } = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Connect to Database
    await connectToDB();

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      // Don't reveal if user exists for security
      return NextResponse.json({ 
        message: "If an account with that email exists, we've sent a reset link." 
      }, { status: 200 });
    }

    // Generate Reset Token - FIXED: Use consistent 32 bytes
    const resetToken = crypto.randomBytes(32).toString("hex");  // 32 bytes = 64 chars
    
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    const passwordResetExpires = Date.now() + 3600000; // 1 hour expiry

    // Clear any existing reset tokens first
    userExist.resetToken = undefined;
    userExist.resetTokenExpiry = undefined;
    await userExist.save();

    // Save new token in DB
    userExist.resetToken = passwordResetToken;
    userExist.resetTokenExpiry = passwordResetExpires;
    await userExist.save();
    
    // Verify what was actually saved
    const savedUser = await User.findOne({ email });
   
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // Use the email template utility for better compatibility
    const htmlBody = createPasswordResetTemplate(resetUrl, 'Doculus');

    // Debug: Log the generated HTML to see what's being sent
    console.log('Generated HTML Body:', htmlBody);
    console.log('Reset URL:', resetUrl);
    console.log('Email being sent to:', email);
    console.log('Mailgun domain:', process.env.MAILGUN_DOMAIN);
    console.log('HTML Body length:', htmlBody.length);

    // Initialize Mailgun
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_APIKEY,
    });

    // Send email
    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Doculus <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: "Reset Your Doculus Password",
        html: htmlBody,
      });

      return NextResponse.json({ 
        message: "If an account with that email exists, we've sent a reset link." 
      }, { status: 200 });

    } catch (emailError) {
      // If email sending fails, remove reset token
      userExist.resetToken = undefined;
      userExist.resetTokenExpiry = undefined;
      await userExist.save();

      console.error("Mailgun Error:", emailError);
      return NextResponse.json({ 
        error: "Failed to send reset email. Please try again." 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ 
      error: "Internal server error. Please try again." 
    }, { status: 500 });
  }
}