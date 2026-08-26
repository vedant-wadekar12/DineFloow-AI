import { Router } from "express";

import {
  authenticate,
  authorizeUser,
} from "../../../middleware/auth";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get(
  "/:userId",
  authenticate,
  authorizeUser,
  (req, res, next) =>
    userController.getProfile(req, res, next)
);

router.patch(
  "/:userId",
  authenticate,
  authorizeUser,
  (req, res, next) =>
    userController.updateProfile(req, res, next)
);


export default router;