import {
  Router,
  Request,
  Response,
} from "express";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./swagger";

const router = Router();

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

router.get(
  "/json",
  (_req: Request, res: Response) => {
    res.json(swaggerSpec);
  }
);

export default router;