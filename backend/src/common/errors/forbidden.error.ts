import { HTTP_STATUS } from "../constants";
import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}