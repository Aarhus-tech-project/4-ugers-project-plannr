// WARNING: This is for demo/dev only. Never expose real API keys in production FE code!
// This example uses Resend (https://resend.com/) for direct email sending from FE (NOT RECOMMENDED for production)

const RESEND_API_KEY = process.env.EXPO_PUBLIC_RESEND_API_KEY // Use EXPO_PUBLIC_ for Expo env vars
const RESEND_DOMAIN = process.env.EXPO_PUBLIC_RESEND_DOMAIN || "yourdomain.com"
const FROM_EMAIL = process.env.EXPO_PUBLIC_RESEND_FROM || `noreply@${RESEND_DOMAIN}`

export async function sendPinEmailDirect(email: string, pin: string) {
  if (!RESEND_API_KEY) throw new Error("Missing Resend API key in env")
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Confirmation PIN",
      html: `<p>Your confirmation PIN is: <b>${pin}</b></p>`,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to send PIN email: ${err}`)
  }
}
