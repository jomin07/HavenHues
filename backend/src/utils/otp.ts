import nodemailer from "nodemailer";

interface OTPData {
  otp: string;
  expires: number;
}

const otpStore = new Map<string, OTPData>();

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const OTP_EXPIRY_TIME = 1 * 60 * 1000;

export const storeOTP = (email: string, otp: string): void => {
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRY_TIME });
};

export const verifyOtp = (email: string, otp: string): boolean => {
  const data = otpStore.get(email);
  if (data && data.otp === otp && Date.now() < data.expires) {
    otpStore.delete(email);
    return true;
  }
  return false;
};
