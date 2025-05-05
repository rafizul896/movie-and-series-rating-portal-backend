import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validationRequest } from "../../middlewares/validationRequest";
import { reviewValidation } from "./review.validation";

const reviewRoutes = Router();


reviewRoutes.post("/",auth(UserRole.ADMIN, UserRole.USER),validationRequest(reviewValidation.addReviewSchema), reviewController.createReview)

reviewRoutes.get("/movie/", reviewController.getAllReview)
reviewRoutes.get("/movie/status", reviewController.getReviews) // (admin) Get all unapproved reviews
reviewRoutes.get("/:id", reviewController.getSingleReview)
reviewRoutes.get("/movie/:movieId", reviewController.getReviewsByMovieId)



reviewRoutes.patch("/:id/approve-toggle",auth(UserRole.ADMIN), reviewController.approvedUnApprovedReview) // (admin) Approve/unpublish

reviewRoutes.patch("/:reviewId",auth(UserRole.USER),validationRequest(reviewValidation.updateReviewSchema), reviewController.editReview) // Edit review (if unpublished)
reviewRoutes.delete("/:id",auth(UserRole.USER,UserRole.ADMIN), reviewController.deleteReview) // Delete review for user and admin


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
