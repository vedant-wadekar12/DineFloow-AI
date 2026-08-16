import { HTTP_STATUS } from "../constants";
import { AppError } from "./app-error";

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}