import { Request } from "express";

import { JwtPayload } from "./jwt-payload.interface";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface UploadRequestFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: NodeJS.ReadableStream;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  file?: Express.Multer.File;
}