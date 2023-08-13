import multer from "multer";
import fs from "fs";
// Multer Configuration

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFile");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().split("T")[0] + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const uploadMiddleware = (req: any, res: any, next: any) => {
  const upload = multer({ storage: storage }).any();
  upload(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err });
    } else if (err) {
      return res.status(500).json({ message: err });
    }

    // [{
    //   fieldname: 'nidORbirth_image',
    //   originalname: '1673576127630.jpeg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: 'uploadFile',
    //   filename: '2023-08-05-1673576127630.jpeg',
    //   path: 'uploadFile/2023-08-05-1673576127630.jpeg',
    //   size: 85172
    // }]
    // send with field name and path
    req.fileUrl = req.files.map((file: any) => {
      return {
        fieldname: file.fieldname,
        path: `${process.env.LIVE_URL}/media/${file.filename}`,
      };
    });
    next();
  });
};

export const fileUploadAndGetUrlFunc = async (file: any) => {
  const { buffer, mimetype, originalname } = file;
  const fileName = `${originalname}-${Math.floor(
    Math.random() * 100 * Date.now()
  )}.${mimetype.split("/")[1]}`;

  fs.writeFile(`uploadFile/${fileName}`, buffer, (err) => {
    if (err) {
      return { message: err.message };
    }
  });
  return `${process.env.LIVE_URL}/media/${fileName}`; //
};
