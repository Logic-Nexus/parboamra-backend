import express from "express";
import type { Request, Response } from "express";

import { body, validationResult } from "express-validator";
import {
  getUserList,
  getUserById,
  getUserProfile,
} from "../Services/User/user.service";

export const userRouter = express.Router();

// GET /api/users

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getUserProfile();
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

//GET USER PROFILE
// userRouter.get("/profile", async (req: Request, res: Response) => {
//   try {
//     const users = await getUserProfile();
//     console.log(users);
//     if (users) {
//       return res.status(200).json(users);
//     } else {
//       return res.status(404).json({ message: "Not Found" });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// });
