/**
 * Email Service (SendGrid)
 * Handles transactional emails: welcome, notifications, admin alerts
 * Falls back gracefully if SendGrid is not configured
 */

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email via SendGrid API
 * Returns true if sent successfully, false otherwise
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@northlandlegendaryfinds.com";
  const fromName = process.env.SENDGRID_FROM_NAME || "Northland Legendary Finds";

  if (!apiKey) {
    console.warn("[Email] SendGrid API key not configured — skipping email send");
    return false;
  }

  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
          },
        ],
        from: {
          email: fromEmail,
          name: fromName,
        },
        subject: options.subject,
        content: [
          ...(options.text ? [{ type: "text/plain", value: options.text }] : []),
          { type: "text/html", value: options.html },
        ],
      }),
    });

    if (response.status === 202) {
      console.log(`[Email] Sent successfully to ${options.to}: ${options.subject}`);
      return true;
    }

    const errorText = await response.text().catch(() => "");
    console.error(`[Email] SendGrid error (${response.status}): ${errorText}`);
    return false;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

// ==================== EMAIL TEMPLATES ====================

const BRAND_COLOR = "#22c55e";
const BRAND_BG = "#0a0a0a";

function wrapInTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <h2 style="color:${BRAND_COLOR};margin:0;font-size:24px;">Northland Legendary Finds</h2>
    </div>
    <div style="background-color:#1a1a1a;border-radius:12px;padding:30px;border:1px solid #333;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:30px;color:#666;font-size:12px;">
      <p>&copy; ${new Date().getFullYear()} Northland Legendary Finds. All rights reserved.</p>
      <p>Marvel Trading Cards &amp; Collectibles</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const firstName = name.split(" ")[0] || "Collector";

  return sendEmail({
    to: email,
    subject: "Welcome to Northland Legendary Finds!",
    html: wrapInTemplate(`
      <h1 style="color:#fff;margin:0 0 15px;font-size:22px;">Welcome, ${firstName}!</h1>
      <p style="color:#ccc;line-height:1.6;margin:0 0 20px;">
        You've joined the Northland Legendary Finds community — your destination for premium Marvel trading cards, 
        exclusive repacks, and collectibles.
      </p>
      <p style="color:#ccc;line-height:1.6;margin:0 0 20px;">
        Here's what you can explore:
      </p>
      <ul style="color:#ccc;line-height:1.8;margin:0 0 20px;padding-left:20px;">
        <li><strong style="color:${BRAND_COLOR};">Card Encyclopedia</strong> — Browse 1,700+ Marvel cards across 6 sets</li>
        <li><strong style="color:${BRAND_COLOR};">Repack Products</strong> — Exclusive mystery packs with guaranteed hits</li>
        <li><strong style="color:${BRAND_COLOR};">Card Shows</strong> — Find sports card shows near you</li>
        <li><strong style="color:${BRAND_COLOR};">Graded Cards</strong> — View our CGC &amp; AGS graded inventory</li>
      </ul>
      <div style="text-align:center;margin:25px 0;">
        <a href="https://northlandlegendaryfinds.com" 
           style="display:inline-block;background:${BRAND_COLOR};color:#000;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Start Exploring
        </a>
      </div>
    `),
    text: `Welcome to Northland Legendary Finds, ${firstName}! Visit https://northlandlegendaryfinds.com to explore our Marvel trading card collection.`,
  });
}

/**
 * Send admin notification when a new user signs up
 */
export async function sendNewUserAdminAlert(userEmail: string, userName: string, loginMethod: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return false;

  return sendEmail({
    to: adminEmail,
    subject: `New User Signup: ${userName || userEmail}`,
    html: wrapInTemplate(`
      <h1 style="color:#fff;margin:0 0 15px;font-size:22px;">New User Registered</h1>
      <table style="width:100%;color:#ccc;line-height:1.8;">
        <tr><td style="color:#888;padding:5px 0;">Name:</td><td style="padding:5px 0;">${userName || "Not provided"}</td></tr>
        <tr><td style="color:#888;padding:5px 0;">Email:</td><td style="padding:5px 0;">${userEmail}</td></tr>
        <tr><td style="color:#888;padding:5px 0;">Login Method:</td><td style="padding:5px 0;">${loginMethod}</td></tr>
        <tr><td style="color:#888;padding:5px 0;">Time:</td><td style="padding:5px 0;">${new Date().toLocaleString()}</td></tr>
      </table>
      <div style="text-align:center;margin:25px 0;">
        <a href="https://northlandlegendaryfinds.com/admin/users" 
           style="display:inline-block;background:${BRAND_COLOR};color:#000;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View in Admin Panel
        </a>
      </div>
    `),
    text: `New user registered: ${userName || "Unknown"} (${userEmail}) via ${loginMethod}`,
  });
}

/**
 * Send role change notification to user
 */
export async function sendRoleChangeEmail(email: string, name: string, newRole: string): Promise<boolean> {
  const firstName = name.split(" ")[0] || "User";
  const roleLabel = newRole === "subscriber" ? "Subscriber" : newRole === "admin" ? "Admin" : "Free";

  return sendEmail({
    to: email,
    subject: `Your Account Has Been Updated — ${roleLabel}`,
    html: wrapInTemplate(`
      <h1 style="color:#fff;margin:0 0 15px;font-size:22px;">Account Update</h1>
      <p style="color:#ccc;line-height:1.6;margin:0 0 20px;">
        Hi ${firstName}, your account role has been updated to <strong style="color:${BRAND_COLOR};">${roleLabel}</strong>.
      </p>
      ${newRole === "subscriber" ? `
      <p style="color:#ccc;line-height:1.6;margin:0 0 20px;">
        As a subscriber, you now have access to premium content, exclusive deals, and early access to new products.
      </p>
      ` : ""}
      <div style="text-align:center;margin:25px 0;">
        <a href="https://northlandlegendaryfinds.com" 
           style="display:inline-block;background:${BRAND_COLOR};color:#000;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Visit Your Account
        </a>
      </div>
    `),
    text: `Hi ${firstName}, your account role has been updated to ${roleLabel}.`,
  });
}
