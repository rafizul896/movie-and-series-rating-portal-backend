import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { NewsLetterService } from "./newsLetter..service";

const createNewsletter = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  // console.log('Creating newsletter with payload:', payload);
  const result = await NewsLetterService.createNewsletter(payload)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter created successfully',
    data: result,
  });
});

const getAllNewsletters = catchAsync(async (req: Request, res: Response) => {
 
  const result = await NewsLetterService.getAllNewsletters()

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'All newsletters retrieved successfully!',
    data: result,
  });
});

const getUserNewsletters = catchAsync(async (req: Request, res: Response) => {
 
  const { userId } = req.params;
  
  const result = await NewsLetterService.getUserNewsletters(userId)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'User newsletters retrieved successfully!',
    data: result,
  });
});

const getNewsletterById = catchAsync(async (req: Request, res: Response) => {
 
  const { id } = req.params;
  const result = await NewsLetterService.getNewsletterById(id)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter retrieved successfully!',
    data: result,
  });
});

const deleteNewsletter = catchAsync(async (req: Request, res: Response) => {
 
  const { id } = req.params;
  const result = await NewsLetterService.deleteNewsletter(id)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter deleted successfully!',
    data: result,
  });
});

const updateNewsletter = catchAsync(async (req: Request, res: Response) => {
 
  const { id } = req.params;

  const result = await NewsLetterService.updateNewsletter(id, req?.body)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter updated successfully!',
    data: result,
  });
});

const subscribeToNewsletter = catchAsync(async (req: Request, res: Response) => {
 
  const { email,name,userId } = req.body;

  const result = await NewsLetterService.subscribeToNewsletter(email, name, userId)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter subscription successful!',
    data: result,
  });
});
const unsubscribeFromNewsletter = catchAsync(async (req: Request, res: Response) => {
 
  const { email } = req.body;

  const result = await NewsLetterService.unsubscribeFromNewsletter(email)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter unsubscription successful!',
    data: result,
  });
});
const sendNewsLetter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await NewsLetterService.sendNewsletter(id)

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message:  'Newsletter sent successfully!',
    data: result,
  });
})


export const NewsletterController = {
    createNewsletter,
    getAllNewsletters,
    getNewsletterById,
    deleteNewsletter,
    updateNewsletter,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    sendNewsLetter,
    getUserNewsletters
}
