import { findExistingUser } from "../../Services/User/user.service";
import generateOTP from "../OTP/otp";
import { transporter } from "./mail";
import HTML_TEMPLATE from "./mail-template";

const usingFor = (usingFor: string) => {
  switch (usingFor) {
    case "resetPassword":
      return "Reset Password";
    case "verifyEmail":
      return "Verify Email";
    default:
      return false;
  }
};
// 3 minute
const OTP_EXPIRATION_SECONDS = 3 * 60;

// Example storage for OTPs and their expiration timestamps (in-memory storage, replace with a proper database)
const otpStorage = {} as any;

// Middleware to send OTP emails
const sendOtpMiddleware = async (req: any, res: any, next: any) => {
  try {
    const checkUserExist = await findExistingUser({
      email: req.body.email,
    });

    if (!checkUserExist) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!req.body.email)
      return res.status(400).json({ message: "Email is required" });
    if (typeof req.body.email !== "string")
      return res.status(400).json({ message: "Email must be a string" });
    if (!req.body.usingFor)
      return res.status(400).json({ message: "Using for is required" });

    if (!usingFor(req.body.usingFor))
      return res.status(400).json({ message: "Invalid using for" });

    if (
      otpStorage[req.body.email] &&
      otpStorage[req.body.email].expiresAt > Date.now()
    ) {
      // Reuse existing OTP if within the expiration window
      req.otpData = otpStorage[req.body.email];
      // console.log("Reusing existing OTP:", otpStorage);
      return next();
    }

    const otp = generateOTP(); // Replace with your OTP generation logic

    const mailOptions = {
      from: process.env.MAIL_USER, // sender address
      to: req.body.email, // list of receivers
      subject: `${usingFor(req.body.usingFor)} OTP`, // Subject line
      text: `Your OTP for ${usingFor(req.body.usingFor)} is ${otp}`, // plain text body
      html: HTML_TEMPLATE(
        `Your OTP for ${usingFor(req.body.usingFor)} is ${otp}`
      ), // html body
    };
    const otpData = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRATION_SECONDS * 1000,
      usingFor: req.body.usingFor,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res
          .status(500)
          .json({ message: `Failed to send OTP ${req.body.email}` });
      }
      console.log("OTP email sent:", info.response);
      otpStorage[req.body.email] = otpData;
      req.otpData = otpData;
      return next();
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ message: "Failed to generate OTP" });
  }
};

export default sendOtpMiddleware;
