import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { movieService } from "./movie.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const addAMovie = catchAsync(async (req: Request, res: Response) => {
    
    const result = await movieService.addAMovie(req.body);
  
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message:  "Add new movie successfully",
      data: result,
    });
  });

const getAllMovie = catchAsync(async (req: Request, res: Response) => {
    
    const result = await movieService.getAllMovie();
  
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message:  "Fetch all movie successfully",
      data: result,
    });
  });
  export const movieController = {
    addAMovie,
    getAllMovie
  };