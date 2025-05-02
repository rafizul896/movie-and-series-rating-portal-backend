import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const reviewRoutes = Router();


reviewRoutes.post("/", reviewController.createReview)
reviewRoutes.get("/movie/", reviewController.getAllReview)
reviewRoutes.get("/:id", reviewController.getSingleReview)
reviewRoutes.get("/movie/:movieId", reviewController.getReviewsByMovieId)
// reviewRoutes.patch("/:id", movieController.updateAMovie)
// reviewRoutes.delete("/soft/:id", movieController.deleteAMovie)

export default reviewRoutes;

// Review Service
// POST /api/reviews - Submit review (requires approval)

// PATCH /api/reviews/:id - Edit review (if unpublished)

// DELETE /api/reviews/:id - Delete review (if unpublished)

// PATCH /api/reviews/:id/approve - (admin) Approve/unpublish

// GET /api/reviews/movie/:movieId - Get reviews for a movie

// Comment Service
// POST /api/comments - Add comment to review

// GET /api/comments/:reviewId - Get comments for a review

// Like Service
// POST /api/likes - Like/unlike review (toggle)
