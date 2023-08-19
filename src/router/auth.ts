import express from "express";
import type { Request, Response } from "express";
// import { body, validationResult } from "express-validator";
import { findExistingUser } from "../Services/User/user.service";
import {
  getOtpList,
  registerUser,
  resetPassword,
  saveOtp,
  updateEmailVerificationStatus,
  updateOtpStatus,
  verifyOtp,
} from "../Services/Auth/auth.service";
import { comparePassword, hashPassword } from "../Others/SecurePassword";
import { generateToken } from "../Others/JWT";
import sendOtpMiddleware, { sendOtp } from "../Others/mail";

export const authRouter = express.Router();

//create user
authRouter.post("/register", async (req: Request, res: Response) => {
  const password = await hashPassword(req.body.password);

  try {
    //first check if user already exists
    const userIsExist = await findExistingUser(req.body);
    // console.log(userIsExist);
    if (userIsExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      password: password,
    };
    const otpData = (await sendOtp(data?.email)) as any;
    const body = {
      email: data?.email,
      otp: otpData?.otp,
      usingFor: otpData?.usingFor,
      expiresAt: otpData?.expiresAt,
    };
    const result = await saveOtp(body);

    if (otpData && result) {
      const user = await registerUser(data);
      // console.log(user);
      if (user) {
        return res.status(200).json({ message: "User created successfully" });
      }
    } else {
      return res.status(400).json({ message: "Error sending OTP email" });
    }
  } catch (error: any) {
    return res.status(500).json(error);
  }
});

//login user
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await findExistingUser(req.body);
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = await comparePassword(
      req.body.password,
      user.password
    );
    // console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const { password, createdAt, updatedAt, isEmailVerified, ...rest } = user;

    if (!isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email is not verified. Please verify your email" });
    }

    const token = await generateToken(rest);
    // console
    return res.status(200).json({
      accessToken: token,
      isLogin: true,
      user: rest,
    });
  } catch (error: any) {
    return res.status(500).json(error);
  }
});

//logout user and delete token

authRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    return res.status(500).json(error);
  }
});

//send mail

authRouter.post(
  "/resetPassword",
  sendOtpMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { otpData } = req as any;
      const { email } = req.body;
      const data = {
        email: email,
        otp: otpData.otp,
        usingFor: otpData?.usingFor,
        expiresAt: otpData?.expiresAt,
      };
      const result = await saveOtp(data);
      await updateOtpStatus(email, "PENDING");
      if (result) {
        return res.status(200).json({
          message:
            "OTP sent to your email successfully. Your otp will expire in 3 minutes",
          result,
        });
      }
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
);

// get otpList

authRouter.get("/otpList", async (req: Request, res: Response) => {
  try {
    const otpList = await getOtpList();
    return res.status(200).json(otpList);
  } catch (error: any) {
    return res.status(500).json(error);
  }
});

//verify otp

authRouter.post("/verifyOtp", async (req: Request, res: Response) => {
  try {
    const { email, otp, usingFor } = req.body;

    const body = {
      email,
      otp,
      usingFor,
    };

    const otpData = (await verifyOtp(body)) as any;
    // console.log(otpData);

    if (!otpData) {
      return res
        .status(400)
        .json({ message: "User not found / Check usingFor" });
    }
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: "OTP does not match" });
    }
    if (otpData.expireAt < new Date()) {
      return res.status(400).json({ message: "OTP expired.Try again" });
    }

    if (usingFor === "resetPassword") {
      const { password } = req.body;
      const newPassword = await hashPassword(password);

      const data = {
        email: email,
        password: newPassword,
      };
      const result = await resetPassword(data);
      if (result) {
        await updateOtpStatus(email, "APPROVED");
        return res.status(200).json({ message: "Password reset successfully" });
      }
    }

    if (usingFor === "verifyEmail") {
      const result = await updateEmailVerificationStatus(email);
      if (result) {
        await updateOtpStatus(email, "APPROVED");
        return res.status(200).json({ message: "Email verified successfully" });
      }
    }
  } catch (error: any) {
    return res.status(500).json(error);
  }
});

//request for email verification

authRouter.post("/verifyEmail", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const findUser = await findExistingUser(req.body);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }
    if (findUser.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email is already verified. Try login" });
    }

    const otpData = (await sendOtp(email)) as any;
    const body = {
      email: email,
      otp: otpData?.otp,
      usingFor: otpData?.usingFor,
      expiresAt: otpData?.expiresAt,
    };
    const result = await saveOtp(body);
    if (otpData && result) {
      return res.status(200).json({
        message:
          "OTP sent to your email successfully. Your otp will expire in 3 minutes",
        result,
      });
    } else {
      return res.status(400).json({ message: "Error sending OTP email" });
    }
  } catch (error: any) {
    return res.status(500).json(error);
  }
});
