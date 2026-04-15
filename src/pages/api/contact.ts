import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, service, message } = data;

    if (!firstName || !email || !message) {
      return new Response(JSON.stringify({ error: 'Please fill all required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: import.meta.env.ZOHO_EMAIL,
        pass: import.meta.env.ZOHO_APP_PASSWORD,
      },
    });

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${firstName} ${lastName || ''}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${phone || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Service</td><td style="padding: 8px; border: 1px solid #ddd;">${service || 'Not selected'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${message}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: `"Finlance Contact Form" <contact@finlance.ae>`,
      to: 'contact@finlance.ae',
      replyTo: email,
      subject: `New Enquiry from ${firstName} ${lastName || ''} - Finlance`,
      html: htmlBody,
    });

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
