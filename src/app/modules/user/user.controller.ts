import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create user
const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.createUserToDB(userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

// admin all user preview
const adminAllUser = catchAsync(async (req, res) => {
  const { email } = req.user;
  const query = req.query;
  const result = await UserServices.adminAllUserFromDB(email, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All user details retived successfully',
    meta: result.meta,
    data: result.result,
  });
});

// admin update user
const adminUpdateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  const result = await UserServices.adminUpdateUserToDB(id, userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

// admin single preview user
const adminDetailsUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.adminDetailsUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User details retived successfully',
    data: result,
  });
});

// admin delete user
const adminDeleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.adminDeleteUserToDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// get user profile
const userProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getUserProfileFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retived successfully',
    data: result,
  });
});

// get user profile
const updateUser = catchAsync(async (req, res) => {
  console.log(req.body);
  const { email } = req.user;

  const result = await UserServices.updateUserToDB(email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

// user follow
const userFollow = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.userFollowToDB(email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User follow successfully',
    data: result,
  });
});

// user unfollow
const userUnfollow = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.userUnfollowToDB(email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User unfollow successfully',
    data: result,
  });
});

// get user followers
const getUserFollowers = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getUserFollowersFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User followers retived successfully',
    data: result,
  });
});

// get user following
const getUserFollowing = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getUserFollowingFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User following retived successfully',
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserServices.changeStatus(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status change successfully',
    data: result,
  });
});

// change user role
const changeUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserServices.changeUserRole(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role change successfully',
    data: result,
  });
});

export const UserController = {
  changeStatus,
  userProfile,
  updateUser,
  userFollow,
  userUnfollow,
  getUserFollowers,
  getUserFollowing,
  changeUserRole,
  adminUpdateUser,
  createUser,
  adminDetailsUser,
  adminAllUser,
  adminDeleteUser,
};
