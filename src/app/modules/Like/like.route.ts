import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { likeController } from "./like.controller";

const likeRoutes = Router();


likeRoutes.post("/:reviewId",auth(UserRole.USER, UserRole.ADMIN), likeController.toggleLike)

export default likeRoutes;