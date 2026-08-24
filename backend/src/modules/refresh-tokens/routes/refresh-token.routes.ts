import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";
import { refreshTokenSchema } from "../../auth/validators/auth.validator";
import { refreshTokenController } from "../controllers/refresh-token.controller";

const router = Router();

router.post(
  "/refresh",
  validateRequest(refreshTokenSchema),
  (req, res, next) =>
    refreshTokenController.refresh(req, res, next)
);

export default router;