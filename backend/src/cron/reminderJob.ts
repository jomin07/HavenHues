import cron from "node-cron";
import nodemailer from "nodemailer";
import Hotel from "../models/hotel";
import User from "../models/user";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Schedule the cron job to run at 3 PM IST (9:30 AM UTC)
cron.schedule("0 15 * * *", async () => {
  try {
    const REMINDER_BEFORE_CHECKIN = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const now = new Date(); // Current time in UTC
    const reminderTime = new Date(now.getTime() + REMINDER_BEFORE_CHECKIN); // Time 48 hours from now
    const toleranceWindow = 60 * 1000; // 1 minute tolerance window

    const hotels = await Hotel.find({
      "bookings.checkIn": {
        $gte: new Date(reminderTime.getTime() - toleranceWindow),
        $lt: new Date(reminderTime.getTime() + toleranceWindow),
      },
      "bookings.reminderSent": false,
    });

    for (const hotel of hotels) {
      for (const booking of hotel.bookings) {
        if (
          booking.checkIn >=
            new Date(reminderTime.getTime() - toleranceWindow) &&
          booking.checkIn <
            new Date(reminderTime.getTime() + toleranceWindow) &&
          !booking.reminderSent
        ) {
          console.log(`Sending reminder for booking ID: ${booking._id}`);
          const user = await User.findById(booking.userID);
          if (user) {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: "Upcoming Booking Reminder",
              text: `Dear ${user.firstName},\n\nThis is a reminder for your upcoming booking. Your check-in time is ${booking.checkIn}. We look forward to hosting you!\n\nBest regards,\nHavenHues Team`,
            };

            await transporter.sendMail(mailOptions);

            await Hotel.updateOne(
              { _id: hotel._id, "bookings._id": booking._id },
              { $set: { "bookings.$.reminderSent": true } }
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error sending reminder emails:", error);
  }
});
