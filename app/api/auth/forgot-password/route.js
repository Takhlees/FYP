import User from "@models/user";
import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Mailgun from "mailgun.js";
import formData from "form-data";
import crypto from "crypto";

export async function POST(req) {
  try {
    // Parse request
    const { email } = await req.json();

    // Connect to Database
    await connectToDB();

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return NextResponse.json({ msg: "User does not exist" }, { status: 404 });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = Date.now() + 3600000; // 1 hour expiry

    // Save token in DB
    userExist.resetToken = passwordResetToken;
    userExist.resetTokenExpiry = passwordResetExpires;
    await userExist.save();

    // Reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Email Body
    const body = `Reset password by clicking on the following link: ${resetUrl}`;

    // Initialize Mailgun
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_APIKEY,
    });

    // Send email
    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: "Doculus.com <noreply@yourdomain.com>",
        to: email,
        subject: "Reset Password",
        text: body,
      });

      return NextResponse.json({ msg: "Reset password email has been sent." }, { status: 200 });

    } catch (error) {
      // If email sending fails, remove reset token
      userExist.resetToken = undefined;
      userExist.resetTokenExpiry = undefined;
      await userExist.save();

      console.error("Mailgun Error:", error);
      return NextResponse.json({ msg: "Failed to send email" }, { status: 500 });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
