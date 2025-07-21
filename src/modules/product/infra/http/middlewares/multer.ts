import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // 👈 use memory instead of disk
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: limit to 10MB
});

export default upload;
