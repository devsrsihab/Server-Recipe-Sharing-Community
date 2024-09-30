/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeServices } from './rating.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create recipe controller
const makeRating = catchAsync(async (req, res) => {
  const { email } = req.user;
  const payload = req.body;
  const result = await RecipeServices.makeRatingToDB(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating created successfully',
    data: result,
  });
});

// get all rating based on recipe id
const getRating = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await RecipeServices.getRatingFromDB(recipeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating fetched successfully',
    data: result,
  });
});



export const RatingController = {
  makeRating,
  getRating,
};
