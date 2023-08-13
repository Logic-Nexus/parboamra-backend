import express from "express";
import type { Request, Response } from "express";

// import { body, validationResult } from "express-validator";
import { findExistingUser } from "../Services/User/user.service";
import { registerUser } from "../Services/Auth/auth.service";
import { comparePassword, hashPassword } from "../Others/SecurePassword";
import { generateToken } from "../Others/JWT";

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
    const user = await registerUser(data);
    // console.log(user);
    if (user) {
      return res.status(200).json({ message: "User created successfully" });
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
    const { password, createdAt, updatedAt, ...rest } = user;
    const token = await generateToken(rest);
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
