import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (email: string, orderData: any) => {
  try {
    const itemsHtml = orderData.items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${item.price}.00</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: `"GreenMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmed! ${orderData.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 200px20px; border-radius: 10px;">
          <h2 style="color: #2e7d32; text-align: center;">Thank You for Your Order! 🌱</h2>
          <p>Hi ${orderData.customerName},</p>
          <p>Your order has been successfully placed. Here are your order details:</p>
           
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Invoice Number:</strong> ${orderData.invoiceNumber}</p>
            <p><strong>Shipping Address:</strong> ${orderData.shippingAddress}</p>
            <p><strong>Contact Number:</strong> ${orderData.phone}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #2e7d32; color: white;">
                <th style="padding: 10px; text-align: left;">Plant Name</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3 style="text-align: right; color: #2e7d32; margin-top: 20px;">Total Amount: Rs. ${orderData.totalAmount}.00</h3>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
          <p style="font-size: 12px; color: #777; text-align: center;">GreenMart Inc. © 2026 | Happy Gardening!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order Confirmation Email sent to: ${email}`);
  } catch (error) {
    console.error("Email sending failed: ", error);
  }
};