import express from "express";
import type { Request, Response } from "express";
import { uploadMiddleware } from "../Others/File/fileUploadController";
import { verifyTokenMiddleware } from "../Others/JWT";
import { createTeacherAcademicQualification } from "../Services/TeacherVerify/teacherVerify.service";

export const teacherVerifyRouter = express.Router();

//POST /api/v1/teacher_profile_verification

teacherVerifyRouter.post(
  "/teacher_profile_verification",
  verifyTokenMiddleware,
  uploadMiddleware,
  async (req: Request, res: Response) => {
    const { fileUrl } = req as any;

    try {
      if (!req.body.userId) {
        return res.status(400).json({ message: "User Id is required" });
      }

      const data = {
        ...req.body,
       
      } as any;
      for (let i = 0; i < fileUrl.length; i++) {
        data[fileUrl[i].fieldname] = fileUrl[i].path;
      }
      //   console.log(data);
      const user = await createTeacherAcademicQualification(data);
      console.log(user);
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "Not Found" });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);
