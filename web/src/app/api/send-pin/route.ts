import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

// In-memory session store for PINs (keyed by email)
type PinSession = { pin: string; expiresAt: number }
declare global {
  // eslint-disable-next-line no-var
  var __pinSessionStore: Map<string, PinSession> | undefined
}
const pinSessionStore: Map<string, PinSession> = globalThis.__pinSessionStore || new Map()
globalThis.__pinSessionStore = pinSessionStore

function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const pin = generatePin()

  // Store PIN in session memory, update if already present
  pinSessionStore.set(email, {
    pin,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
  })

  const html = `
    <div style="background:linear-gradient(135deg,#f9f9f9 60%,#e63946 100%);padding:0;margin:0;min-height:100vh;">
      <div style="max-width:420px;margin:48px auto;padding:32px 24px;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);border-radius:24px;box-shadow:0 8px 32px rgba(230,57,70,0.12),0 1.5px 8px rgba(0,0,0,0.04);font-family:'Inter',Arial,sans-serif;">
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:24px;">
          <img src='https://svgshare.com/i/15wA.svg' alt='Plannr' style='height:40px;margin-right:12px;'/>
          <h2 style="font-size:2rem;font-weight:800;color:#e63946;letter-spacing:1px;margin:0;">Plannr</h2>
        </div>
        <h3 style="font-size:1.5rem;font-weight:700;color:#222;margin-bottom:16px;text-align:center;">Your Verification Code</h3>
        <p style="font-size:1.1rem;color:#444;margin-bottom:28px;text-align:center;">Enter this code to verify your email address and continue creating your account.</p>
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">
          <span style="font-size:2.5rem;font-weight:900;letter-spacing:0.5em;color:#e63946;background:rgba(230,57,70,0.08);padding:18px 32px;border-radius:16px;box-shadow:0 2px 8px rgba(230,57,70,0.08);border:2px solid #e63946;">${pin}</span>
        </div>
        <p style="color:#666;font-size:1rem;text-align:center;margin-bottom:0;">If you did not request this, you can ignore this email.</p>
        <div style="margin-top:40px;text-align:center;color:#aaa;font-size:0.9rem;">Plannr &copy; 2025</div>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: "Plannr <no-reply@plannrschool.dk>",
      to: [email],
      subject: "Your Plannr Verification Code",
      html,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
