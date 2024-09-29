import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// student create controller
const createStudent = catchAsync(async (req, res) => {
  const { password, student: studetnData } = req.body;
  const result = await UserServices.createStudentToDB(req.file, password, studetnData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student created successfully',
    data: result,
  });
});

// create faculty controller
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: studetnData } = req.body;
  const result = await UserServices.createFacultyToDB(password, studetnData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

// create faculty controller
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: studetnData } = req.body;
  const result = await UserServices.createAdminToDB(password, studetnData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

// get user profile
const userProfile = catchAsync(async (req, res) => {
  const { email, role } = req.user;

  const result = await UserServices.getUserProfileFromDB(email, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retived successfully',
    data: result,
  });
});

// get user profile
const updateUser = catchAsync(async (req, res) => {
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


// get me controller
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMeFromDB(userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get me retived successfully',
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status change successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
  userProfile,
  updateUser,
  userFollow,
  userUnfollow,
  getUserFollowers,
  getUserFollowing
};
