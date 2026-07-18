export function getResetPasswordEmailHtml(
    email: string,
    resetUrl: string
): string {
    return  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Set Your Password – Admin Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    a { color: inherit; }

    body {
      background-color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #18181b;
      margin: 0;
      padding: 0;
    }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      .email-body { padding: 24px 20px !important; }
      .email-header { padding: 28px 20px !important; }
      .email-footer { padding: 20px !important; }
      .btn { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body>

<!-- Preheader (hidden preview text) -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
  Action required: Set your password to access the admin dashboard.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#ffffff; padding: 40px 16px;">
  <tr>
    <td align="center">

      <!-- Email card -->
      <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px; border:2px solid #e4e4e7; width:100%; background:#ffffff; border-radius:12px; overflow:hidden;
               box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);">

        <!-- ── HEADER ── -->
        <tr>
          <td class="email-header" align="center"
            style="background-color:#16205B; padding: 36px 40px;">
            <!-- Logo / Brand name -->
            <a href="https://adlcoalition.org" style="text-decoration:none;">
                    <img src="https://i.imgur.com/pfDB0Wt.png" alt="ADLC Logo" width="200" height:"500" style="display:block; border:0; outline:none; text-decoration:none;" />
            </a>
          </td>
        </tr>

        <!-- ── HERO / GREETING ── -->
        <tr>
          <td class="email-body" style="padding: 40px 48px 32px;">
            <h1 style="font-size:24px; font-weight:700; color:#18181b; margin:0 0 12px; line-height:1.3; letter-spacing:-0.3px;">
              Set your password
            </h1>
            <p style="font-size:16px; color:#52525b; margin:0 0 20px; line-height:1.7;">
              We received a request to reset the password for your account. To complete the process and access the admin dashboard, please click the button below to set a new password.
            </p>

            <!-- Divider -->
            <hr style="border:none; border-top:1px solid #e4e4e7; margin: 28px 0;" />

            <!-- Info box -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
              style="background-color:#ffffff; border-radius:8px; margin:0 0 28px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="font-size:13px; font-weight:600; color:#18181b; margin:0 0 6px; text-transform:uppercase; letter-spacing:0.5px;">
                    Your account details
                  </p>
                  <p style="font-size:14px; color:#52525b; margin:0 0 4px;">
                    <strong style="color:#4B2E38;">Email:</strong>&nbsp; ${email}
                  </p>
                  <p style="font-size:14px; color:#52525b; margin:0;">
                    <strong style="color:#4B2E38;">Role:</strong>&nbsp; Administrator
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px;">
              <tr>
                <td style="border-radius:8px; background-color:#FF7300;">
                  <a class="btn" href="${resetUrl}"
                    style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600;
                           color:#FFFFFF; text-decoration:none; border-radius:25px; letter-spacing:0.1px;">
                    Set my password →
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:13px; color:#a1a1aa; margin:0 0 28px;">
              This link expires in <strong style="color:#71717a;">24 hours</strong>. If you didn't expect this email, you can safely ignore it.
            </p>

            <!-- Divider -->
            <hr style="border:none; border-top:1px solid #e4e4e7; margin: 28px 0;" />

            <!-- Steps -->
            <h2 style="font-size:16px; font-weight:600; color:#18181b; margin:0 0 14px;">
              What happens next
            </h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px;">
              <tr>
                <td style="padding: 6px 0;">
                  <span style="color:#18181b; font-size:15px; font-weight:600;">1.&nbsp;&nbsp;</span>
                  <span style="color:#52525b; font-size:14px;">Click the button above and set a strong password</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">
                  <span style="color:#18181b; font-size:15px; font-weight:600;">2.&nbsp;&nbsp;</span>
                  <span style="color:#52525b; font-size:14px;">Sign in to the admin dashboard with your email and new password</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">
                  <span style="color:#18181b; font-size:15px; font-weight:600;">3.&nbsp;&nbsp;</span>
                  <span style="color:#52525b; font-size:14px;">You're in — start managing your workspace</span>
                </td>
              </tr>
            </table>

            <!-- Sign-off -->
            <p style="font-size:15px; font-weight:600; color:#18181b; margin: 8px 0 0;">
              African Diaspora Leadership Coalition 
            </p>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td class="email-footer"
            style="background-color:#ffffff; border-top:1px solid #e4e4e7; padding:28px 48px; text-align:center;">

            <!-- Footer links -->
            <p style="margin:0 0 12px;">
              <a href="mailto:isha@wouessi.com" style="font-size:13px; color:#71717a; text-decoration:none; margin:0 10px;">Contact Support</a>
            </p>

            <!-- Address / legal -->
            <p style="font-size:12px; color:#a1a1aa; margin:0; line-height:1.6;">
              © 2026 African Diaspora Leadership Coalition.<br />
              This is a system-generated email. You received it because an admin account was created for you.
            </p>
          </td>
        </tr>

      </table>
      <!-- /Email card -->

    </td>
  </tr>
</table>

</body>
</html>`

}
