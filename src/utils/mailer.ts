import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendInvoiceEmail = async (
    to: string,
    invoiceRef: string,
    amount: number,
    paymentUrl: string
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Invoice - Media Reservation',
        html: `
      <h2>Thank you for your reservation</h2>
      <p>Invoice Reference: <strong>${invoiceRef}</strong></p>
      <p>Amount: <strong>₦${amount}</strong></p>
      <p>Click below to proceed with payment:</p>
      <a href="${paymentUrl}">Pay Now</a>
    `,
    };

    await transporter.sendMail(mailOptions);
};
