import express from "express";

import apiRouter from "./api";

import {
  compressionConfig,
  cookieParserConfig,
  corsConfig,
  helmetConfig,
  loggerConfig,
} from "./config";

import {
  errorHandler,
  notFoundMiddleware,
  rateLimiter,
  requestLogger,
} from "./middleware";

const app = express();

app.use(helmetConfig);

app.use(corsConfig);

app.use(compressionConfig);

app.use(cookieParserConfig);

app.use(loggerConfig);

app.use(requestLogger);

app.use(rateLimiter);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(notFoundMiddleware);

app.use(errorHandler);

export default app;