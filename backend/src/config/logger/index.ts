import morgan from "morgan";
export * from "./logger";

export const loggerConfig = morgan("dev");