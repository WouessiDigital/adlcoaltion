import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { FROM_EMAIL, getResend } from "@/lib/resend";
import { getNotificationEmailHtml } from "@/lib/notification-template";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/submissions
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { getDb } = await import("@/lib/data/db");
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO members (name, email, message)
      VALUES (?, ?, ?)
    `);
    
    const base = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const loginUrl = `${base.replace(/\/$/, "")}/admin/dashboard`;
    const emailHtml = getNotificationEmailHtml(name, email, message, loginUrl);
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ishoyy.a@gmail.com";
    // Send email in background so slow/failed email delivery doesn't block the HTTP response
    getResend()
      .emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "You have a new submission on African Diaspora Leaders Coalition",
        html: emailHtml,
      })
      .then((resp) => console.log("Resend response:", resp))
      .catch((emailErr) => console.error("Resend send error:", emailErr));



    stmt.run(name, email, message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
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
