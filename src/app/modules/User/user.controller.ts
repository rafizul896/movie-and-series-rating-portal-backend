import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: { accessToken: result.accessToken },
  });
});

const getAllUsersFromDB = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User data fetched successfully',
    data: result,
  });
});

const getUserByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User data fetched by id!',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.updateIntoDB(id, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User data is updated.',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User data is Deleted!',
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.softDeleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User data is Deleted!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
