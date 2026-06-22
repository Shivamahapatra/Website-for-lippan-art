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

export async function sendReviewEmail(
  customerEmail: string,
  customerName: string,
  trackingId: string
) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const reviewLink = `${baseUrl}/review/${trackingId}`;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("--- MOCK REVIEW REQUEST EMAIL ---");
    console.log(`To: ${customerEmail}`);
    console.log(`Subject: How do you like your new Lippan Art?`);
    console.log(`Review Link: ${reviewLink}`);
    console.log("---------------------------------");
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

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #8c5a45;">Thank you for your purchase!</h2>
        <p>Hi ${customerName},</p>
        <p>We hope you are absolutely loving your new handcrafted Lippan Art piece!</p>
        
        <p>As an independent artist, your feedback means the world to us and helps other art lovers find their perfect piece.</p>
        
        <div style="margin: 30px 0;">
          <a href="${reviewLink}" style="background-color: #8c5a45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Leave a Review
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:<br>
        <a href="${reviewLink}" style="color: #8c5a45;">${reviewLink}</a></p>
        
        <p>Warmest regards,<br>Her Lippan Art</p>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Her Lippan Art" <${EMAIL_USER}>`,
      to: customerEmail,
      subject: "How do you like your new Lippan Art? 🌟",
      text: `Thank you for your purchase! Please leave a review here: ${reviewLink}`,
      html: htmlContent,
    });
    console.log("Review request email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send review request email:", error);
    return false;
  }
}

export async function sendPickupEmail(
  customerEmail: string,
  customerName: string,
  trackingId: string
) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("--- MOCK PICKUP EMAIL ---");
    console.log(`To: ${customerEmail}`);
    console.log(`Subject: Your Order is Ready for Pickup! 🎉`);
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

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #8c5a45;">Your order is ready!</h2>
        <p>Hi ${customerName},</p>
        <p>Great news! Your handcrafted Lippan Art piece (Tracking ID: <strong>${trackingId}</strong>) is complete and ready for you to pick up.</p>
        
        <div style="background: #faf8f5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2d8d3;">
            <h3 style="margin-top: 0; color: #8c5a45;">Pickup Details</h3>
            <p><strong>Studio Address:</strong><br/>
            F401 Innovative Aqua Front, 403<br/>
            Vibhutipura Extension, Doddanekkundi<br/>
            Bengaluru, Karnataka 560037</p>
            <p><a href="https://maps.app.goo.gl/4Nufp26ZGrZjBsYA7" style="color: #8c5a45; font-weight: bold;">Open in Google Maps</a></p>
            <p><strong>Contact:</strong> 7899214104</p>
        </div>
        
        <p>Please bring a copy of this email or your Tracking ID with you.</p>
        <p>Warmest regards,<br>Her Lippan Art</p>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Her Lippan Art" <${EMAIL_USER}>`,
      to: customerEmail,
      subject: "Your Order is Ready for Pickup! 🎉",
      text: `Your order ${trackingId} is ready for pickup at our studio in Bengaluru.`,
      html: htmlContent,
    });
    console.log("Pickup email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send pickup email:", error);
    return false;
  }
}
