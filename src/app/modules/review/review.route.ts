import { Router } from "express";
import { reviewController } from "./review.controller";

const reviewRoutes = Router();


reviewRoutes.post("/", reviewController.createReview)
// reviewRoutes.get("/", movieController.getAllMovie)
// reviewRoutes.patch("/:id", movieController.updateAMovie)
// reviewRoutes.delete("/soft/:id", movieController.deleteAMovie)

export default reviewRoutes;