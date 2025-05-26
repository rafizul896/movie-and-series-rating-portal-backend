import { Router } from "express";
import { commentsController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validationRequest } from "../../middlewares/validationRequest";
import { CommentsValidation } from "./controller.validation";

const commentRoutes = Router();


commentRoutes.post("/",auth(UserRole.USER, UserRole.ADMIN),validationRequest(CommentsValidation.createCommentZodSchema), commentsController.addAComment)
commentRoutes.get("/", commentsController.getUnApprovedComments)
commentRoutes.get("/:reviewId", commentsController.getCommentsByReview)

commentRoutes.patch("/approve-toggle", 
    // validationRequest(CommentsValidation.CommentIDsSchema),
    auth(UserRole.ADMIN),
 commentsController.approvedUnapprovedComments)

commentRoutes.patch("/:commentId",auth(UserRole.USER),
validationRequest(CommentsValidation.updateCommentZodSchema),
 commentsController.editComment) // Edit comment (if unpublished)

commentRoutes.delete("/delete-comments",auth(UserRole.ADMIN,UserRole.USER),
// validationRequest(CommentsValidation.CommentIDsSchema),
 commentsController.deleteComments)

export default commentRoutes;