import nodemailer from 'nodemailer';
import path from 'path';

interface SendWelcomeEmailInput {
  email: string;
  name: string;
  shopName: string;
  licenseNumber: string;
}

// Create nodemailer SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER || 'marunnundo.in@gmail.com',
    pass: process.env.EMAIL_PASS, // App Password
  },
});

/**
 * Sends a premium branded HTML welcome email to the newly registered pharmacy.
 */
export async function sendWelcomeEmail({ email, name, shopName, licenseNumber }: SendWelcomeEmailInput) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marunnundo-in.vercel.app';
    const loginUrl = `${baseUrl}/login`;
    
    // Use the 100% public, unauthenticated GitHub Raw CDN URL for the logo.
    // This guarantees that Google's Image Proxy will not be blocked by Vercel's Deployment Protection (password screen)
    // and successfully renders the logo inside Gmail without stripping the src attribute.
    const logoUrl = 'https://raw.githubusercontent.com/m-icky/marunnundo.in/main/public/logo.png';

    // Dynamic Plain-text Fallback (Crucial to prevent spam filters)
    const textContent = `Welcome to Marunnundo.in, ${name}

Thank you for registering your pharmacy, "${shopName}", on Marunnundo.in. We are thrilled to welcome you to our network of verified pharmacies.

Your pharmacy profile is currently Pending Verification by our administration team. We manually verify all credentials to ensure full compliance with drugs control department standards. This process is usually completed in less than 24 hours.

In the meantime, you can log in to your merchant dashboard to configure your pharmacy settings, operating hours, and start uploading your medicine inventory.

Go to Login Dashboard: ${loginUrl}

Registration Details:
- Pharmacy Name: ${shopName}
- License Number: ${licenseNumber}
- Registered Email: ${email}
- Verification Status: Pending

If you have any questions or need immediate assistance, please reach out to our merchant helpline at +91 79027 65146 or email us at marunnundo.in@gmail.com.

Best regards,
The Marunnundo.in Team`;

    // Dynamic HTML Template (Clean light-themed styling optimized for maximum inbox deliverability)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Marunnundo.in</title>
        <style>
          body {
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            background-color: #f8fafc;
            padding: 30px 15px;
          }
          .email-card {
            background-color: #ffffff;
            border-radius: 12px;
            max-width: 580px;
            margin: 0 auto;
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .email-header {
            background-color: #ffffff;
            padding: 24px 30px;
            text-align: center;
            border-bottom: 3px solid #10b981;
          }
          .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            width: 80px;
            height: 80px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            padding: 2px;
            vertical-align: middle;
          }
          .logo-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .brand-text {
            color: #0f172a;
            font-size: 22px;
            font-weight: 800;
            margin-left: 10px;
            vertical-align: middle;
            display: inline-block;
            letter-spacing: -0.5px;
          }
          .brand-accent {
            color: #10b981;
          }
          .email-body {
            padding: 35px 30px;
            color: #334155;
          }
          h1 {
            color: #0f172a;
            font-size: 20px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 18px;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 18px;
            color: #475569;
          }
          .details-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 18px;
            margin: 24px 0;
          }
          .details-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
          }
          .detail-row {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            font-weight: 600;
            color: #64748b;
            display: inline-block;
            width: 125px;
          }
          .detail-value {
            color: #0f172a;
            font-weight: 700;
          }
          .status-badge {
            background-color: #fef3c7;
            color: #d97706;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            display: inline-block;
            border: 1px solid #fde68a;
          }
          .btn-container {
            text-align: center;
            margin: 28px 0 8px;
          }
          .btn-primary {
            background-color: #10b981;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 700;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
          }
          .email-footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
          }
          .footer-links a {
            color: #10b981;
            text-decoration: none;
            font-weight: 600;
          }
          .support-contact {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-card">
            
            <!-- Header Section -->
            <div class="email-header">
              <div class="logo-container">
                <img src="${logoUrl}" alt="Logo" class="logo-img">
              </div>
              <span class="brand-text">Marunnundo<span class="brand-accent">.in</span></span>
            </div>

            <!-- Body Section -->
            <div class="email-body">
              <h1>Welcome to Marunnundo.in, ${name}</h1>
              <p>
                Thank you for registering your pharmacy, <strong>${shopName}</strong>, on <strong>Marunnundo.in</strong>. 
                We are excited to have you join Kerala's premier medicine discovery platform.
              </p>
              
              <p>
                Your pharmacy profile is currently <strong>Pending Verification</strong> by our administration team. 
                We manually check the credentials of all physical stores to ensure absolute compliance with government drugs department standards. 
                This process usually takes less than 24 hours.
              </p>
              
              <p>
                In the meantime, you can log in to your merchant dashboard to configure your pharmacy settings, operating hours, and start uploading your medicine inventory.
              </p>

              <!-- Pharmacy Registration Details Card -->
              <div class="details-card">
                <div class="details-title">Registration Summary</div>
                <div class="detail-row">
                  <span class="detail-label">Pharmacy Name:</span>
                  <span class="detail-value">${shopName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">License Number:</span>
                  <span class="detail-value">${licenseNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Login Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="status-badge">Pending Verification</span>
                </div>
              </div>

              <!-- CTA Button -->
              <div class="btn-container">
                <a href="${loginUrl}" target="_blank" class="btn-primary">Go to Login Dashboard</a>
              </div>
            </div>

            <!-- Footer Section -->
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} Marunnundo.in. All rights reserved.</p>
              <div class="footer-links">
                <a href="${baseUrl}/privacy" target="_blank">Privacy Policy</a>
                <span style="margin: 0 8px; color: #cbd5e1;">|</span>
                <a href="${baseUrl}/terms" target="_blank">Terms of Service</a>
              </div>
              <div class="support-contact">
                <strong>Need assistance?</strong> Reach our merchant helpline at 
                <span style="color: #10b981; font-weight: 700;">+91 79027 65146</span> 
                or reply directly to this email at <a href="mailto:marunnundo.in@gmail.com" style="color: #10b981; text-decoration: none; font-weight: 600;">marunnundo.in@gmail.com</a>.
              </div>
            </div>

          </div>
        </div>
      </body>
      </html>
    `;

    // Standard SMTP Options (Attaching removed to prevent spam triggers and paperclip icons)
    const mailOptions = {
      from: `"Marunnundo Support" <${process.env.EMAIL_USER || 'marunnundo.in@gmail.com'}>`,
      to: email,
      subject: `Welcome to Marunnundo.in - ${shopName}`,
      text: textContent, // Plain-text fallback version
      html: htmlContent, // Branded HTML version
    };

    // Verify SMTP connection config first
    if (!process.env.EMAIL_PASS) {
      console.warn('EMAIL_PASS is not defined in environment variables. Welcome email was not sent.');
      return { success: false, error: 'EMAIL_PASS missing' };
    }

    // Send Mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email successfully sent to ${email}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message || 'Error occurred while sending mail' };
  }
}
