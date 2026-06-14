import express from "express";
import {
  signupController,
  loginController,
  getProfileController,
  toggleFavoriteController,
  getFavoritesController,
} from "../controller/auth.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, getProfileController);
router.post("/favorites/toggle", authMiddleware, toggleFavoriteController);
router.get("/favorites", authMiddleware, getFavoritesController);

export default router;
