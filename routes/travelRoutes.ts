import { Router } from "express";
import {
  createBookmark,
  createChatMessage,
  createExpense,
  createGroup,
  createItinerary,
  getBookmarks,
  getWeather,
} from "../controllers/travelController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const travelRouter = Router();
travelRouter.use(requireAuth);

travelRouter.post("/bookmark", asyncHandler(createBookmark));
travelRouter.get("/bookmarks", asyncHandler(getBookmarks));
travelRouter.post("/itinerary", asyncHandler(createItinerary));
travelRouter.post("/chat", asyncHandler(createChatMessage));
travelRouter.post("/expense", asyncHandler(createExpense));
travelRouter.post("/group", asyncHandler(createGroup));
travelRouter.post("/weather", asyncHandler(getWeather));

export default travelRouter;