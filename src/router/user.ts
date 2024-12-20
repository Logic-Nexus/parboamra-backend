import express from "express";
import type { Request, Response } from "express";

// import { body, validationResult } from "express-validator";
import {
  getUserList,
  getUserById,
  createUserProfile,
  deleteUser,
  updateUserProfileImage,
  deleteAllUsers,
} from "../Services/User/user.service";
import {
  fileUploadAndGetUrlFunc,
  uploadMiddleware,
} from "../Others/File/fileUploadController";
import { verifyTokenMiddleware } from "../Others/JWT";
import { deleteAllOtp } from "../Services/Auth/auth.service";

export const userRouter = express.Router();

// GET /api/users

userRouter.get(
  "/",
  verifyTokenMiddleware,
  async (req: Request, res: Response) => {
    //permission check
    const { user } = req as any;
    const { userName: isQueryWithUserName } = req.query;
    // convert isQueryWithUserName to boolean
    const isQueryWithUserNameBoolean = isQueryWithUserName === "true";

    if (user.role !== "ADMIN") {
      return res.status(400).json({ message: "You have no permission" });
    }

    if (!isQueryWithUserNameBoolean && isQueryWithUserName) {
      return res
        .status(400)
        .json({
          message: "Bad Request",
          hint: "Please use query with userName as true in boolean",
        });
    }

    try {
      const users = await getUserList();
      // console.log(users);
      if (users) {
        if (isQueryWithUserName) {
          const filteredUsers = users.map((user: any) => {
            const { userName } = user;
            return userName;
          });
          return res.status(200).json(filteredUsers);
        }
        return res.status(200).json(users);
      } else {
        return res.status(404).json({ message: "No user found" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
);

//get user by id
userRouter.get(
  "/:id",
  verifyTokenMiddleware,
  async (req: Request, res: Response) => {
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
  }
);

//get onlY user profile
userRouter.get(
  "/profile/:id",
  verifyTokenMiddleware,
  async (req: Request, res: Response) => {
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
  }
);

//create/update user profile
userRouter.put(
  "/profile/:userId",
  verifyTokenMiddleware,
  async (req: any, res) => {
    // console.log(req);
    const userId = parseInt(req.params.userId);
    // console.log(userId);
    try {
      if (!userId)
        return res.status(400).json({ message: "User Id is required" });

      const data = {
        ...req.body,
        userId,
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
  }
);

//update user profile image
userRouter.post(
  "/profile-image",
  verifyTokenMiddleware,
  uploadMiddleware,
  async (req: any, res) => {
    const { fileUrl } = req as any;
    try {
      if (!req.body.userId)
        return res.status(400).json({ message: "User Id is required" });
      // console.log(req.fileUrl);
      const data = {
        ...req.body,
      };

      for (let i = 0; i < fileUrl.length; i++) {
        data[fileUrl[i].fieldname] = fileUrl[i].path;
      }

      // console.log(data);
      const userProfile = await updateUserProfileImage(data);
      // // console.log(users);
      if (userProfile) {
        return res.status(200).json(userProfile);
      }
    } catch (error: any) {
      // console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

// delete user
userRouter.delete(
  "/:id",
  verifyTokenMiddleware,
  async (req: Request, res: Response) => {
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
  }
);

//delete all users
userRouter.delete(
  "/",

  async (req: Request, res: Response) => {
    try {
      const deletedUser = await deleteAllUsers();
      const deletedAllOtp = await deleteAllOtp();
      if (deletedUser && deletedAllOtp) {
        return res.status(200).json({ message: "All Users Deleted" });
      }
    } catch (error: any) {
      return res.status(400).json({ message: "Bad Request" });
    }
  }
);
