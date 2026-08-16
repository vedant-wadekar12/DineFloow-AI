import { HTTP_STATUS } from "../constants";
import { AppError } from "./app-error";

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}