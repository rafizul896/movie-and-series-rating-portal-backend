import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: result,
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

export const UserControllers = {
  createUser,
  getAllUsersFromDB,
};
