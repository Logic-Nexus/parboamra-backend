import express from "express";
import type { Request, Response } from "express";

import { body, validationResult } from "express-validator";
import { findExistingUser } from "../Services/User/user.service";
import { registerUser } from "../Services/Auth/auth.service";

export const authRouter = express.Router();

//create user
authRouter.post("/register", async (req: Request, res: Response) => {
  // console.log(req.body.email);
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
      password: req.body.password,
    };
    const user = await registerUser(data);
    // console.log(user);
    if (user) {
      return res.status(200).json({ message: "User created successfully" });
    }
  } catch (error: any) {
    return res.status(500).json(error?.meta);
  }
});
