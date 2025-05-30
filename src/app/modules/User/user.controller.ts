import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import pick from '../../shared/pick';

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
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await UserService.getAllUsersFromDB(options);

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

// const getMyProfile = catchAsync(async (req, res) => {
//   const result = await UserService.getUserByIdFromDB(req.user);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: 'Profile fetched successfully',
//     data: result,
//   });
// });

const updateIntoDB = catchAsync(async (req, res) => {
  const result = await UserService.updateIntoDB(req);

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
