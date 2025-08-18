import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Mailgun from "mailgun.js";
import formData from "form-data";
import crypto from "crypto";
import { createPasswordResetTemplate } from "@utils/emailTemplates";
 
export async function POST(req) {
  try {
    const { email } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    await connectToDB();

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return NextResponse.json({ 
        message: "If an account with that email exists, we've sent a reset link." 
      }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex"); 
    
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    const passwordResetExpires = Date.now() + 3600000; 

    userExist.resetToken = undefined;
    userExist.resetTokenExpiry = undefined;
    await userExist.save();

    userExist.resetToken = passwordResetToken;
    userExist.resetTokenExpiry = passwordResetExpires;
    await userExist.save();
    
    const savedUser = await User.findOne({ email });

    if(!savedUser){
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }
   
    const baseUrl = process.env.NEXTAUTH_URL;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    const htmlBody = createPasswordResetTemplate(resetUrl, 'Doculus');

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_APIKEY,
    });

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