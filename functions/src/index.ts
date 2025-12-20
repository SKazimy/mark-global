import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Contact form data interface
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  createdAt: admin.firestore.Timestamp;
}

// Get email configuration from Firebase environment config
// Set these using: firebase functions:config:set email.user="your@email.com" email.pass="yourpassword"
// Or use environment variables in .env file for local development
const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
    },
  };
};

// Create reusable transporter
const createTransporter = () => {
  const config = getEmailConfig();
  functions.logger.info("Email config:", {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    passLength: config.auth.pass?.length || 0,
  });
  return nodemailer.createTransport(config);
};

// Email template for user confirmation
const getUserEmailTemplate = (name: string, message: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Mark Global</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Mark Global</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 14px;">Digital Marketing Excellence</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px;">Thank You for Reaching Out, ${name}!</h2>
              
              <p style="color: #4b5563; line-height: 1.7; margin: 0 0 20px; font-size: 16px;">
                We've received your message and appreciate you taking the time to contact us. Our team is reviewing your inquiry and will get back to you within <strong>24 hours</strong>.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #6b7280; margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Message:</p>
                <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.6; font-style: italic;">"${message}"</p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.7; margin: 0 0 20px; font-size: 16px;">
                In the meantime, feel free to explore our services or follow us on social media for the latest updates and insights.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://themarkglobal.co.in" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit Our Website</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="color: #9ca3af; margin: 0 0 10px; font-size: 14px;">
                Mark Global - Digital Marketing Solutions
              </p>
              <p style="color: #6b7280; margin: 0 0 15px; font-size: 13px;">
                Delhi, India | info@themarkglobal.co.in | +91 88607 70991
              </p>
              <div style="margin-top: 20px;">
                <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">LinkedIn</a>
                <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">Twitter</a>
                <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Email template for admin notification
const getAdminEmailTemplate = (name: string, email: string, message: string, timestamp: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">📬 New Contact Form Submission</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Name:</strong>
                  </td>
                  <td style="padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #1f2937;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Email:</strong>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Submitted:</strong>
                  </td>
                  <td style="padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #1f2937;">${timestamp}</span>
                  </td>
                </tr>
              </table>
              
              <div style="margin-top: 25px;">
                <p style="color: #374151; font-weight: 600; margin: 0 0 10px;">Message:</p>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="color: #4b5563; margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Callable function - called directly from client and returns result
export const submitContactForm = functions.https.onCall(async (data, context) => {
  const { name, email, message } = data;

  // Validate input
  if (!name || !email || !message) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || "info@themarkglobal.co.in";
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    // Save to Firestore first
    const docRef = await admin.firestore().collection("contacts").add({
      name,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Mark Global" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Mark Global!",
      html: getUserEmailTemplate(name, message),
    });

    functions.logger.info(`Confirmation email sent to user: ${email}`);

    // Send notification email to admin
    await transporter.sendMail({
      from: `"Mark Global Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: getAdminEmailTemplate(name, email, message, timestamp),
    });

    functions.logger.info(`Notification email sent to admin: ${adminEmail}`);

    // Update the document to mark email as sent
    await docRef.update({
      emailSent: true,
      emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    functions.logger.error("Error in submitContactForm:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new functions.https.HttpsError("internal", `Failed to send email: ${errorMessage}`);
  }
});
