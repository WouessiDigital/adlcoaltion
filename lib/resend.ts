import { Resend } from "resend";

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "no-reply@adlcoalition.org";

// Lazy singleton — only instantiated when first used, not at module load time
// This prevents crashes during migrations when RESEND_API_KEY isn't needed
let resendInstance: Resend | null = null;

export function getResend(): Resend {
    if (resendInstance) return resendInstance;
    
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    resendInstance = new Resend(apiKey);
    return resendInstance;
}

// Keep resend export for backward compatibility but make it a proxy
export const resend = new Proxy({} as Resend, {
    get(_, prop) {
        return (getResend() as any)[prop];
    }
});
