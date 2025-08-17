/**
 * Email Template Utilities
 * Provides reusable email templates and components that work across all email clients
 */

/**
 * Creates a universal email button that works in all email clients
 * @param {string} text - Button text
 * @param {string} url - Button URL
 * @param {Object} options - Button styling options
 * @returns {string} HTML string for the button
 */
export function createUniversalEmailButton(text, url, options = {}) {
  const {
    backgroundColor = '#4F46E5',
    textColor = '#ffffff',
    fontSize = '16px',
    padding = '15px 30px',
    borderRadius = '6px',
    minWidth = '200px',
    fontFamily = 'Arial, sans-serif'
  } = options;

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
            <td align="center" style="border-radius: ${borderRadius}; background-color: ${backgroundColor}; padding: 0;">
                <a href="${url}" 
                   style="display: block; 
                          padding: ${padding}; 
                          background-color: ${backgroundColor}; 
                          color: ${textColor} !important; 
                          text-decoration: none !important; 
                          font-size: ${fontSize}; 
                          font-weight: bold; 
                          border-radius: ${borderRadius}; 
                          font-family: ${fontFamily};
                          border: 2px solid ${backgroundColor};
                          line-height: 1.2;
                          text-align: center;
                          min-width: ${minWidth};
                          text-decoration: none !important;"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${text}
                </a>
            </td>
        </tr>
    </table>
  `;
}

/**
 * Creates an email-compatible button that works in all email clients
 * @param {string} text - Button text
 * @param {string} url - Button URL
 * @param {Object} options - Button styling options
 * @returns {string} HTML string for the button
 */
export function createEmailButton(text, url, options = {}) {
  const {
    backgroundColor = '#4F46E5',
    textColor = '#ffffff',
    fontSize = '16px',
    padding = '15px 30px',
    borderRadius = '6px',
    minWidth = '200px',
    fontFamily = 'Arial, sans-serif'
  } = options;

  return `
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:50px;v-text-anchor:middle;width:${minWidth};" arcsize="12%" stroke="f" fillcolor="${backgroundColor}">
        <w:anchorlock/>
        <center style="color:${textColor};font-family:${fontFamily};font-size:${fontSize};font-weight:bold;">${text}</center>
    </v:roundrect>
    <![endif]-->
    
    <!--[if !mso]><!-->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
            <td align="center" style="border-radius: ${borderRadius}; background-color: ${backgroundColor}; padding: 0;">
                <a href="${url}" 
                   style="display: block; 
                          padding: ${padding}; 
                          background-color: ${backgroundColor}; 
                          color: ${textColor} !important; 
                          text-decoration: none; 
                          font-size: ${fontSize}; 
                          font-weight: bold; 
                          border-radius: ${borderRadius}; 
                          font-family: ${fontFamily};
                          border: 2px solid ${backgroundColor};
                          line-height: 1.2;
                          text-align: center;
                          min-width: ${minWidth};
                          mso-hide: all;
                          text-decoration: none !important;"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${text}
                </a>
            </td>
        </tr>
    </table>
    <!--<![endif]-->
  `;
}

/**
 * Creates a password reset email template
 * @param {string} resetUrl - Password reset URL
 * @param {string} appName - Application name
 * @returns {string} HTML body for the email
 */
export function createPasswordResetTemplate(resetUrl, appName = 'Doculus') {
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
                    You requested a password reset for your ${appName} account. Click the button below to reset your password:
                </p>
            </div>
            
            <!-- Button Container -->
            <div style="padding: 0 40px 30px 40px; text-align: center; background-color: #ffffff;">
                ${createUniversalEmailButton('Reset Password', resetUrl)}
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
                    This is an automated email from ${appName}. Please do not reply to this email.
                </p>
            </div>
            
        </div>
    </div>
</body>
</html>
  `;

  return htmlBody;
}
