import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { Request, Response } from 'express';
import { TUser } from '../../interface/user.type';

const loginUser = catchAsync(async (req:Request, res:Response) => {
  const result = await AuthServices.loginUser(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User login success',
    data: { accessToken: result.accessToken },
  });
});

const refreshToken = catchAsync(async (req:Request, res:Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Refresh Token',
    data: result,
  });
});

const changePassword = catchAsync(async (req:Request, res:Response) => {
  const user = req.user as TUser;
  const result = await AuthServices.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password changed Successfully!',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req:Request, res:Response) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Check you email and reset your password.',
    data: result,
  });
});

const resetPassword = catchAsync(async (req:Request, res:Response) => {
  const token = req.headers.authorization || "";
  const result = await AuthServices.resetPassword(token,req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset is successfully",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};
