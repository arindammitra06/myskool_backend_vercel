import multer from "multer";
import path from "path";
import fs from "fs";

export const createMulterStorage = () => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uid = req.params.uid || req.body.uid;

        if (!uid) {
          return cb(new Error("UID not provided"), "");
        }

        // Create folder path
        const uploadPath = path.join("uploads", uid);

        // Create folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },

      filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
      },
    }),

    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });
};
