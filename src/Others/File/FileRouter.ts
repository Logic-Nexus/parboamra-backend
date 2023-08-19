import express from "express";
import multer from "multer";
import fs from "fs";

export const fileRouter = express.Router();
const upload = multer({
//   storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

fileRouter.post("/", upload.single("attachment"), async (req, res) => {
  const { buffer, mimetype, originalname } = req.file as any;
  const fileName = `${originalname}-${Date.now()}.${mimetype?.split("/")[1]}`;
  try {
    fs.writeFile(`uploadFile/${fileName}`, buffer, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
    });
    return res.status(200).json({
      message: "Upload file success",
      fileName,
      path: `${process.env.LIVE_URL}/media/${fileName}`,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});
