/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeServices } from './comment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create recipe controller
const makeComment = catchAsync(async (req, res) => {
  const { email } = req.user;
  const payload = req.body;
  const result = await RecipeServices.makeCommentToDB(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

// get all rating based on recipe id
const getComment = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await RecipeServices.getCommentFromDB(recipeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment fetched successfully',
    data: result,
  });
});



export const CommentController = {
  makeComment,
  getComment,
};
