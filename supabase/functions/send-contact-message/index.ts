// Contact message confirmation email — sends a copy of the submitted message
// to the email address the visitor entered in the contact form.
//
// Deploy:
//   supabase functions deploy send-contact-message
//   supabase secrets set RESEND_API_KEY=re_... EMAIL_FROM="Rezonants <no-reply@rezonants.com>"
//
// The contact form is public, so this endpoint does not require an
// authenticated user. If the function is not deployed or the provider key is
// missing, the client keeps the message and only logs the error — the message
// is never blocked by email delivery.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

interface ContactMessage {
  to: string
  name: string
  email: string
  company: string
  subject: string
  message: string
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? 'Rezonants <no-reply@rezonants.com>'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function renderEmail(data: ContactMessage): { text: string; html: string } {
  const greeting = `Dear ${data.name.trim()},`
  const body = [
    `Thank you for reaching out to Rezonants. This is a copy of the message we received from you.`,
    `Our team will review your message and get back to you within 24 hours.`,
  ]
  const details = [
    `Name: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    data.company.trim() ? `Company: ${data.company.trim()}` : null,
    data.subject.trim() ? `Subject: ${data.subject.trim()}` : null,
    `Message: ${data.message.trim()}`,
  ].filter(Boolean)
  const closing = 'Best Regards,\nRezonants Team'

  const text = `${greeting}\n\n${body.join('\n\n')}\n\n${details.join('\n\n')}\n\n${closing}`

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: #12352A; background: #FFFFFF; padding: 20px; border: 1px solid #D5EFDD; border-radius: 10px;">
      <p>${greeting}</p>
      ${body.map((paragraph) => `<p style="color: #3F5A4D;">${paragraph}</p>`).join('')}
      <table style="border-collapse: collapse; margin: 16px 0;">
        ${details
          .map(
            (line) => `<tr><td style="padding: 6px 12px 6px 0; vertical-align: top; color: #12352A;">${line}</td></tr>`,
          )
          .join('')}
      </table>
      <p>Best Regards,<br />Rezonants Team</p>
    </div>
  `

  return { text, html }
}

async function sendContactEmail(data: ContactMessage): Promise<Response> {
  if (!RESEND_API_KEY) {
    console.error(
      'send-contact-message: RESEND_API_KEY is not configured. Run: supabase secrets set RESEND_API_KEY=...',
    )
    return new Response(
      JSON.stringify({ error: 'Email provider is not configured' }),
      { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  const { text, html } = renderEmail(data)
  const payload = {
    from: EMAIL_FROM,
    to: [data.to],
    subject: 'We received your message – Rezonants',
    text,
    html,
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error(`send-contact-message: Resend responded ${response.status}: ${detail}`)
    return new Response(
      JSON.stringify({ error: 'Email provider rejected the request' }),
      { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  console.log(`send-contact-message: email sent to ${data.to}`)
  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
  )
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  let body: ContactMessage
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const { to, name, email, subject, message } = body
  const company = body.company ?? ''
  if (!to || !name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: 'to, name, email, subject and message are required' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  return sendContactEmail({ to, name, email, company, subject, message })
})
