import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { likeService } from "./like.service";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";

const toggleLike = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

  const result = await likeService.toggleLike(user?.email, req.params.reviewId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: result.liked ? 'Review liked' : 'Review unLiked',
    data: result,
  });
});

export const likeController = {
    toggleLike,
}
