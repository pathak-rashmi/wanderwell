import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/signup", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", requireAuth, asyncHandler(logout));

export default authRouter;