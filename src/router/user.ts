import express from "express";
import type { Request, Response } from "express";

import { body, validationResult } from "express-validator";
import {
  getUserList,
  getUserById,
  createUserProfile,
} from "../Services/User/user.service";
import { uploadMiddleware } from "../Others/File/fileUploadController";

export const userRouter = express.Router();

// GET /api/users

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getUserList();
    // console.log(users);
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
});

//get user by id
userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    // console.log(users);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
});

//create user profile
userRouter.post("/profile", uploadMiddleware, async (req, res) => {
  console.log(req.body);
  try {
    const data = {
      ...req.body,
      // image: req.fileUrl ? req.fileUrl : "",
    };
    // const userProfile = await createUserProfile(req.body);
    // console.log(users);
    // if (userProfile) {
    //   return res.status(200).json(userProfile);
    // }
  } catch (error: any) {
    return res.status(500).json({ message: error.meta });
  }
});
