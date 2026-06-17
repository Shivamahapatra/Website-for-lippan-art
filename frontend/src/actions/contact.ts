"use server";

import nodemailer from "nodemailer";

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("--- MOCK CONTACT FORM SUBMISSION ---");
    console.log(`From: ${data.name} <${data.email}>`);
    console.log(`Phone: ${data.phone}`);
    console.log(`Message: ${data.message}`);
    console.log("------------------------------------");
    return { success: true }; // Simulate success for dev
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
      <h2 style="color: #8c5a45;">New Contact Form Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message}</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Store Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Send TO the store owner
      replyTo: data.email, // So the owner can reply directly to the customer
      subject: `New Inquiry from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage:\n${data.message}`,
      html: htmlContent,
    });
    
    console.log("Contact form email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send contact email:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}
