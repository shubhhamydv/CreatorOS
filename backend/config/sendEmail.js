import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,

  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

// Send Mail Function
const sendMail = async (to, otp) => {

  try {

    await transporter.sendMail({
      from: process.env.USER,
      to: to,
      subject: "Reset Your Password",
      html:`<p> your OTP for password Reset is <b>${otp}</b>
      It expires in 5 minutes.
      </p>`
    });

    console.log("Email Sent Successfully");

  } 
  catch (error) {

    console.log("Error sending mail:", error);

  }

};

export default sendMail;