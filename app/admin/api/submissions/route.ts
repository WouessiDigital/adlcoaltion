import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { FROM_EMAIL, getResend } from "@/lib/resend";
import { getNotificationEmailHtml } from "@/lib/notification-template";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Abuse protection for the public membership form ---------------------------------
// Simple in-memory limit per IP (one container, so memory is enough): 5 submissions / 10 min.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

// Escape user input before it goes into the admin notification email (blocks HTML/link injection).
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NAME_RE = /^[\p{L}\p{M}]+([ '’.-]+[\p{L}\p{M}]+)*\.?$/u;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

// POST /api/submissions
export async function POST(req: Request) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Honeypot: real visitors never see or fill the "website" field; bots do. Pretend success.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const locale = body.locale === "fr" ? "fr" : "en";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (name.length > 100 || !NAME_RE.test(name)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (message.length > 3000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const { getDb } = await import("@/lib/data/db");
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO members (name, email, message)
      VALUES (?, ?, ?)
    `);
    stmt.run(name, email, message);

    const base = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const loginUrl = `${base.replace(/\/$/, "")}/admin/dashboard`;
    const emailHtml = getNotificationEmailHtml(esc(name), esc(email), esc(message).replace(/\n/g, "<br>"), loginUrl);
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ishoyy.a@gmail.com";
    // Send in the background so slow email delivery doesn't block the response.
    getResend()
      .emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `${locale === "fr" ? "[FR] " : ""}You have a new submission on African Diaspora Leaders Coalition`,
        html: emailHtml,
      })
      .catch((emailErr) => console.error("Resend send error:", emailErr));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/submissions
export async function GET() {
  // protect submission listing: only allow authenticated sessions
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { getDb } = await import("@/lib/data/db");
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM members
    ORDER BY datecreated DESC
  `);

  return NextResponse.json(stmt.all());
}
