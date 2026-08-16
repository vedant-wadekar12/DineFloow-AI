import { HTTP_STATUS } from "../constants";
import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(message = "Validation Failed") {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}