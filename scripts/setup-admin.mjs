/**
 * One-time admin setup script
 * Generates a secure password, creates the admin account, and sends credentials to admin email
 */
import { randomBytes } from "crypto";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL;
const BUILT_IN_FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const BUILT_IN_FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const OWNER_NAME = process.env.OWNER_NAME;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Generate a secure 12-character password: letters + numbers + symbols
function generatePassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@$%&";
  const all = upper + lower + digits + symbols;
  
  const buf = randomBytes(16);
  let pass = "";
  // Ensure at least one of each type
  pass += upper[buf[0] % upper.length];
  pass += lower[buf[1] % lower.length];
  pass += digits[buf[2] % digits.length];
  pass += symbols[buf[3] % symbols.length];
  // Fill remaining 8 chars from all
  for (let i = 4; i < 12; i++) {
    pass += all[buf[i] % all.length];
  }
  // Shuffle
  return pass.split("").sort(() => buf[12] % 2 === 0 ? 1 : -1).join("");
}

async function sendEmail(to, subject, htmlBody) {
  if (!BUILT_IN_FORGE_API_URL || !BUILT_IN_FORGE_API_KEY) {
    console.log("No forge API configured — skipping email send");
    return false;
  }
  
  try {
    const res = await fetch(`${BUILT_IN_FORGE_API_URL}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BUILT_IN_FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        to,
        subject,
        html: htmlBody,
      }),
    });
    const data = await res.json();
    console.log("Email API response:", JSON.stringify(data));
    return res.ok;
  } catch (err) {
    console.error("Email send error:", err.message);
    return false;
  }
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Check if admin already exists
    const [existing] = await conn.execute("SELECT id FROM admin_credentials LIMIT 1");
    if (existing.length > 0) {
      console.log("Admin account already exists. To reset, delete the row from admin_credentials first.");
      process.exit(0);
    }

    const username = "nlfadmin";
    const displayName = "NLF Admin";
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert admin credentials
    await conn.execute(
      "INSERT INTO admin_credentials (username, password_hash, display_name, is_active, must_change_password) VALUES (?, ?, ?, 1, 1)",
      [username, passwordHash, displayName]
    );

    console.log("\n✅ Admin account created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email:    admin@nlfservices.com`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Send email with credentials
    const emailTo = "admin@nlfservices.com";
    const subject = "Northland Legendary Finds — Your Admin Dashboard Credentials";
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
    .container { max-width: 520px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
    .header { background: #000; padding: 24px 32px; border-bottom: 1px solid #222; }
    .header h1 { color: #22c55e; font-size: 20px; margin: 0; letter-spacing: 0.05em; }
    .header p { color: #666; font-size: 12px; margin: 4px 0 0; }
    .body { padding: 32px; }
    .cred-box { background: #0a0a0a; border: 1px solid #22c55e33; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .cred-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
    .cred-value { color: #22c55e; font-family: monospace; font-size: 16px; font-weight: bold; }
    .url-box { background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center; }
    .url-box a { color: #22c55e; text-decoration: none; font-family: monospace; font-size: 14px; }
    .warning { background: #1a0a00; border: 1px solid #f97316; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .warning p { color: #f97316; font-size: 13px; margin: 0; }
    .footer { padding: 20px 32px; border-top: 1px solid #222; text-align: center; }
    .footer p { color: #444; font-size: 11px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NORTHLAND LEGENDARY FINDS</h1>
      <p>Admin Dashboard Access</p>
    </div>
    <div class="body">
      <p style="color:#aaa; font-size:14px;">Your admin dashboard credentials have been created. Use the information below to access the Matrix portal.</p>
      
      <div class="cred-box">
        <div class="cred-row">
          <span class="cred-label">Username</span>
          <span class="cred-value">${username}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Password</span>
          <span class="cred-value">${password}</span>
        </div>
      </div>

      <p style="color:#aaa; font-size:13px; margin-bottom:8px;">Access the admin dashboard at:</p>
      <div class="url-box">
        <a href="https://northlandlegendaryfinds.com/matrix">northlandlegendaryfinds.com/matrix</a>
      </div>

      <div class="warning">
        <p>⚠️ Save these credentials in a secure password manager. This email will not be sent again. You can change your password in the admin dashboard after logging in.</p>
      </div>
    </div>
    <div class="footer">
      <p>Northland Legendary Finds — Marvel Trading Cards Community</p>
    </div>
  </div>
</body>
</html>
    `;

    const sent = await sendEmail(emailTo, subject, html);
    if (sent) {
      console.log(`✅ Credentials email sent to ${emailTo}`);
    } else {
      console.log(`⚠️  Email could not be sent automatically. Credentials are shown above — save them now.`);
    }

  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
