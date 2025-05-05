import { Router } from "express";
import { commentsController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const commentRoutes = Router();


commentRoutes.post("/",auth(UserRole.USER, UserRole.ADMIN), commentsController.addAComment)
commentRoutes.get("/", commentsController.getUnApprovedComments)
commentRoutes.get("/:reviewId", commentsController.getCommentsByReview)

commentRoutes.patch("/approve-toggle",auth(UserRole.ADMIN), commentsController.approvedUnapprovedComments)

export default commentRoutes;