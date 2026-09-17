import path from "path";
import fs from "fs";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads"
);

// Create uploads directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDirectory);
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const extension = path.extname(file.originalname);

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Documents
  "application/pdf",

  // Common office documents
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(
      new Error(
        "Invalid file type. Only images and supported documents are allowed."
      )
    );
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,

  limits: {
    // Maximum file size: 5 MB
    fileSize: 5 * 1024 * 1024,

    // Only one file per request
    files: 1,
  },

  fileFilter,
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          message: "File size must not exceed 5 MB.",
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next();
  });
};