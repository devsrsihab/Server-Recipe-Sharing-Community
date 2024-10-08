/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

// register
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Register  successfully',
    data: result,
  });
});

// login
const loginUser = catchAsync(async (req, res) => {
  const result: any = await AuthServices.loginUser(req.body);
  const { srsRecipeRefreshToken, srsRecipeAccessToken, needPassWord } = result;

  // save refresh token in cookie
  res.cookie('srsRecipeRefreshToken', srsRecipeRefreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'login successfully',
    data: { srsRecipeAccessToken, needPassWord },
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const user = req?.user;
  console.log(req?.body);
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'access token retrive successfully',
    data: result,
  });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset Link generated successfully',
    data: result,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  registerUser,
};
