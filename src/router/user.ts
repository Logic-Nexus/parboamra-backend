import express from "express";
import type { Request, Response } from "express";

import { body, validationResult } from "express-validator";
import {
  getUserList,
  getUserById,
  getUserProfile,
  createUser,
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
  }
});

//create user
userRouter.post("/register", uploadMiddleware, async (req: any, res) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    profile: {
      bio: req.body.bio,
      image: req.fileUrl,
    },
  };
  console.log(data);
  try {
    // const user = await createUser(data) ;
    // // console.log(users);
    // if (user) {
    //   return res.status(200).json(user);
    // } else {
    //   return res.status(404).json({ message: "Not Found" });
    // }
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});
