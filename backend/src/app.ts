import express from "express";

import apiRouter from "./api";
import { errorHandler, notFoundMiddleware } from "./middleware";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(notFoundMiddleware);

app.use(errorHandler);

export default app;