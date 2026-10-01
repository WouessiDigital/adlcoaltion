import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import path from "path";
import fs from "fs";
import BetterSqlite3 from "better-sqlite3";
import { FROM_EMAIL, getResend } from "./resend";
import { getResetPasswordEmailHtml } from "./email-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

let dbInstance: InstanceType<typeof BetterSqlite3> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  // FIX: Updated to match AUTH_DB_PATH as required by the Coolify setup document
  const dbPath = process.env.AUTH_DB_PATH || process.env.DB_PATH || path.join(process.cwd(), "lib", "data", "sqlite.db");

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    console.log("Creating database directory...");
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = new BetterSqlite3(dbPath);
  return dbInstance;
}

function createAuth() {
  // Read production domain cleanly, strip any trailing slashes to prevent string mismatch
  const rawBase = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const appBase = rawBase.replace(/\/$/, ""); 
  
  // Build trusted origins list dynamically
  const trustedOrigins = [appBase];
  
  if (process.env.NODE_ENV === "development") {
    trustedOrigins.push(
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000"
    );
  } else {
    // FIX: Trust variations of your production domain to survive cross-origin reverse proxies
   trustedOrigins.push(
  "https://adlcoalition.org",
  "https://www.adlcoalition.org",
  "http://adlcoalition.org",
  "http://www.adlcoalition.org"
);
  }

  return betterAuth({
    database: getDb(),
    trustedOrigins,
    baseURL: appBase,
    basePath: "/admin/api/auth",

    advanced: {
      // FIX: Ensure proxy forwarding header checks are trusted behind Coolify (Nixpacks/Docker)
      useSecureCookies: process.env.NODE_ENV === "production",
      cookiePrefix: "adlc",
      crossSubDomainCookies: {
        enabled: true, // Switched to true if client accesses both www. and root domain apexes
      },
      allowCredentialsOnCrossOrigin: true,
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, token }) => {
        const clientLink = `${appBase}/admin/reset-password?token=${encodeURIComponent(token)}`;
        try {
          const emailHtml = getResetPasswordEmailHtml(user.email, clientLink);
          const { data, error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: emailHtml,
          });
        } catch (error) {
          throw new Error("Failed to send reset password email");
        }
      }
    },
  });
}

export const auth = createAuth();