import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${token}`
    };

    await transporter.sendMail(mailOptions);
};