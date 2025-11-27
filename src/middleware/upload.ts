import multer from "multer";
import { createMulterStorage } from "../shared/services/multer-storage";

const upload = createMulterStorage();

export const uploadSingleFile = upload.single("file");
export const uploadMultipleFiles = upload.array("files", 10);
