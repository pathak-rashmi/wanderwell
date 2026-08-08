import { Router } from "express";
import { getProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const profileRouter = Router();
profileRouter.use(requireAuth);
profileRouter.get("/profile", asyncHandler(getProfile));

export default profileRouter;