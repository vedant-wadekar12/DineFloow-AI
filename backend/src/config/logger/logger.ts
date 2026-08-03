import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `[${timestamp}] ${level}: ${stack}`
    : `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),

  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],

  exceptionHandlers: [
    new transports.Console(),
  ],

  rejectionHandlers: [
    new transports.Console(),
  ],
});