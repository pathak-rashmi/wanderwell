import { Router } from "express";
import {
  createPackingItem,
  deletePackingItem,
  getPackingItem,
  getPackingItems,
  updatePackingItem,
} from "../controllers/packingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const packingRouter = Router();

packingRouter.use(requireAuth);
packingRouter.post("/", asyncHandler(createPackingItem));
packingRouter.get("/", asyncHandler(getPackingItems));
packingRouter.get("/:id", asyncHandler(getPackingItem));
packingRouter.patch("/:id", asyncHandler(updatePackingItem));
packingRouter.delete("/:id", asyncHandler(deletePackingItem));

export default packingRouter;