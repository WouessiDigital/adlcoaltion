import SignUpForm from "./SignUpForm";

// SECURITY: the previous version compared a secret token in the browser, and the token was
// published in this public repository. Admin sign-up is now controlled on the server only
// (ADMIN_SIGNUP_ENABLED, see lib/auth.ts). When it is off, the API refuses sign-ups too.
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  if (process.env.ADMIN_SIGNUP_ENABLED !== "true") {
    return <div style={{ padding: "20px", textAlign: "center" }}>Access Denied.</div>;
  }
  return <SignUpForm />;
}
