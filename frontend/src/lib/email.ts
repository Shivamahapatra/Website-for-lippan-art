import nodemailer from "nodemailer";

export async function sendReceiptEmail(
  customerEmail: string,
  customerName: string,
  trackingId: string,
  cartItems: any[],
  total: number
) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("--- MOCK RECEIPT EMAIL ---");
    console.log(`To: ${customerEmail}`);
    console.log(`Subject: Order Confirmation - Her Lippan Art`);
    console.log(`Tracking ID: ${trackingId}`);
    console.log("--------------------------");
    return false;
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

  const itemsHtml = cartItems
    .map(
      (item) =>
        `<li>${item.quantity}x ${item.product.name} - ₹${
          Number(item.product.price) * item.quantity
        }</li>`
    )
    .join("");

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #8c5a45;">Thank You For Your Order!</h2>
        <p>Hi ${customerName},</p>
        <p>We have successfully received your payment of <strong>₹${total}</strong>.</p>
        
        <div style="background: #faf8f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul>${itemsHtml}</ul>
            <p style="font-size: 1.2em;"><strong>Total: ₹${total}</strong></p>
        </div>
        
        <p>Your tracking ID is: <strong><span style="font-size: 1.2em; color: #8c5a45;">${trackingId}</span></strong></p>
        <p>We will notify you as soon as your order is ready for pickup.</p>
        <br>
        <p>Best regards,<br>Her Lippan Art</p>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Her Lippan Art" <${EMAIL_USER}>`,
      to: customerEmail,
      subject: "Order Confirmation - Her Lippan Art",
      text: "Thank you for your order! Please enable HTML to view this receipt.",
      html: htmlContent,
    });
    console.log("Receipt sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    return false;
  }
}
