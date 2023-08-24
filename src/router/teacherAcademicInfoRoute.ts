import express from "express";
import type { Request, Response } from "express";
import { uploadMiddleware } from "../Others/File/fileUploadController";
import { verifyTokenMiddleware } from "../Others/JWT";
import {
  createTeacherAcademicQualification,
  getTeacherAcademicQualificationOwnVerifyData,
  getTeacherAcademicQualificationVerify,
  updateTeacherAcademicQualificationVerify,
} from "../Services/TeacherVerify/teacherVerify.service";

export const teacherVerifyRouter = express.Router();

//POST /api/v1/teacher_profile_verification

teacherVerifyRouter.post(
  "/teacher_profile_verification",
  verifyTokenMiddleware,
  uploadMiddleware,
  async (req: Request, res: Response) => {
    const { fileUrl, user } = req as any;

    try {
      if (user.role !== "TUTOR" && user.role !== "ADMIN") {
        return res.status(400).json({ message: "You have no permission" });
      }

      if (!req.body.userId) {
        return res.status(400).json({
          message: "You have to provide your identification id",
        });
      }

      const data = {
        ...req.body,
      } as any;

      for (let i = 0; i < fileUrl.length; i++) {
        data[fileUrl[i].fieldname] = fileUrl[i].path;
      }
      //   console.log(data);
      const result = await createTeacherAcademicQualification(data);
      // console.log(result);
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Not Found" });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

//GET /api/v1/teacher_profile_verification/pending
teacherVerifyRouter.get(
  "/teacher_profile_verification",
  verifyTokenMiddleware,

  async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { status } = req.query;
      // console.log(user.role);
      if (user.role !== "ADMIN" && user.role !== "TUTOR") {
        return res.status(400).json({ message: "You have no permission" });
      }
      if (user.role === "TUTOR") {
        const result = await getTeacherAcademicQualificationOwnVerifyData(
          user?.id,
          status
        );
        return res.status(200).json(result);
      }
      const { pageNumber, perPageValue } = req.query;

      const result = await getTeacherAcademicQualificationVerify(
        status,
        pageNumber,
        perPageValue
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
);

//UPDATE /api/v1/teacher_profile_verification/:userId
//admin can update teacher profile verification to APPROVED or REJECTED

teacherVerifyRouter.put(
  "/teacher_profile_verification/:userId",
  verifyTokenMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      if (user.role !== "ADMIN") {
        return res.status(400).json({ message: "You have no permission" });
      }
      const userId = parseInt(req.params.userId);
      const { status, rejectReason } = req.body;
      // console.log(req.body);
      const result = await updateTeacherAcademicQualificationVerify(
        userId,
        status,
        rejectReason
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
);
