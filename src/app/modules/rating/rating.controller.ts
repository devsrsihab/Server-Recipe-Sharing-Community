/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeServices } from './rating.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create recipe controller
const makeRating = catchAsync(async (req, res) => {
  const { email } = req.user;
  const payload = req.body;
  const result = await RecipeServices.makeRating(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating created successfully',
    data: result,
  });
});




export const RatingController = {
  makeRating,
};
