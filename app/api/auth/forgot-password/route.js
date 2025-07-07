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

const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="width: 100%; background-color: #f4f4f4; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="padding: 40px 40px 20px 40px; text-align: center; background-color: #ffffff;">
                <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">Password Reset Request</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 0 40px 30px 40px; background-color: #ffffff;">
                <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; font-family: Arial, sans-serif;">
                    You requested a password reset for your Doculus account. Click the button below to reset your password:
                </p>
            </div>
            
            <!-- Button Container -->
            <div style="padding: 0 40px 30px 40px; text-align: center; background-color: #ffffff;">
                <div style="display: inline-block;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="12%" stroke="f" fillcolor="#4F46E5">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Reset Password</center>
                    </v:roundrect>
                    <![endif]-->
                    
                    <!--[if !mso]><!-->
                    <a href="${resetUrl}" 
                       style="display: inline-block; 
                              padding: 15px 30px; 
                              background-color: #4F46E5; 
                              color: #ffffff !important; 
                              text-decoration: none; 
                              font-size: 16px; 
                              font-weight: bold; 
                              border-radius: 6px; 
                              font-family: Arial, sans-serif;
                              border: none;
                              cursor: pointer;
                              mso-hide: all;"
                       target="_blank"
                       rel="noopener noreferrer">
                        Reset Password
                    </a>
                    <!--<![endif]-->
                </div>
            </div>
            
            <!-- Alternative Link -->
            <div style="padding: 0 40px 20px 40px; background-color: #ffffff;">
                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border: 1px solid #e9ecef; margin: 10px 0;">
                    <a href="${resetUrl}" 
                       style="color: #4F46E5 !important; 
                              text-decoration: underline; 
                              word-break: break-all; 
                              font-size: 14px; 
                              font-family: monospace;"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${resetUrl}
                    </a>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div style="padding: 20px 40px 40px 40px; border-top: 1px solid #eeeeee; background-color: #ffffff;">
                <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">
                    <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
                </p>
                <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">
                    If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 40px; background-color: #f8f9fa;">
                <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; font-family: Arial, sans-serif;">
                    This is an automated email from Doculus. Please do not reply to this email.
                </p>
            </div>
            
        </div>
    </div>
</body>
</html>`;

// Also update the text version to be more explicit
const textBody = `
PASSWORD RESET REQUEST
======================

You requested a password reset for your Doculus account.

🔗 RESET YOUR PASSWORD HERE:
${resetUrl}

⏰ IMPORTANT: This link expires in 1 hour for security.

📋 INSTRUCTIONS:
1. Click the link above
2. Enter your new password
3. Confirm your new password
4. Your account will be updated immediately

❓ TROUBLESHOOTING:
- If the link doesn't work, copy and paste the entire URL into your browser
- Make sure you're using a modern web browser
- Clear your browser cache if you encounter issues

🛡️ SECURITY NOTICE:
If you didn't request this password reset, please ignore this email and your password will remain unchanged.

Need help? Contact our support team.

---
Doculus Support Team
${process.env.NEXTAUTH_URL || 'http://localhost:3000'}
`;

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
        text: textBody,
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
      error: "An unexpected error occurred. Please try again." 
    }, { status: 500 });
  }
}