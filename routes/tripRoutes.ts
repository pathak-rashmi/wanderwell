import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from "../controllers/tripController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const tripRouter = Router();

tripRouter.use(requireAuth);
tripRouter.post("/", asyncHandler(createTrip));
tripRouter.get("/", asyncHandler(getTrips));
tripRouter.get("/:id", asyncHandler(getTrip));
tripRouter.patch("/:id", asyncHandler(updateTrip));
tripRouter.delete("/:id", asyncHandler(deleteTrip));

export default tripRouter;