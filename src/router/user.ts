import express from "express";
import type { Request, Response } from "express";

import { body, validationResult } from "express-validator";
import {
  getUserList,
  getUserById,
  createUserProfile,
  deleteUser,
} from "../Services/User/user.service";
import { uploadMiddleware } from "../Others/File/fileUploadController";

export const userRouter = express.Router();

// GET /api/users

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getUserList();
    // console.log(users);
    if (users.length > 0) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "No user found" });
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
      const { password, ...rest } = user;
      return res.status(200).json(rest);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
});

//get onlY user profile
userRouter.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    // console.log(users);
    if (user) {
      return res.status(200).json(user.profile);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error });
  }
});

//create user profile
userRouter.put("/profile", uploadMiddleware, async (req: any, res) => {
  try {
    if (!req.body.userId)
      return res.status(400).json({ message: "User Id is required" });

    if (!req.fileUrl)
      return res.status(400).json({ message: "Image is required" });

    const data = {
      ...req.body,
      image: req?.fileUrl,
    };
    // console.log(data);
    const userProfile = await createUserProfile(data);
    // // console.log(users);
    if (userProfile) {
      return res.status(200).json(userProfile);
    }
  } catch (error: any) {
    // console.log(error);
    return res.status(500).json({ message: error });
  }
});

// delete user
userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    // console.log(users);
    if (user) {
      const deletedUser = await deleteUser(id);
      if (deletedUser) {
        return res.status(200).json({ message: "User Deleted" });
      }
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: "Bad Request" });
  }
});

