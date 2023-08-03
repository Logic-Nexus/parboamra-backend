import multer from "multer";
import fs from "fs";
// Multer Configuration

export const uploadMiddleware = (req: any, res: any, next: any) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });
  upload.single("attachment")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!req.file) return res.status(400).json({ message: "File not found" });

    const { buffer, mimetype, originalname } = req?.file as any;
    const fileName = `${originalname}-${Math.floor(
      Math.random() * 100 * Date.now()
    )}.${mimetype.split("/")[1]}`;

    fs.writeFile(`uploadFile/${fileName}`, buffer, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
    });
    req.fileUrl = `${process.env.LIVE_URL}/media/${fileName}`; //
    next();
  });
};

