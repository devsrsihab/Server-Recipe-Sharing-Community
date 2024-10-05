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

// get all comments
const getAllComments = catchAsync(async (req, res) => {
  const result = await RecipeServices.getAllCommentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments fetched successfully',
    data: result,
  });
});

// update comment status
const updateCommentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await RecipeServices.updateCommentStatus(id, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment status updated successfully',
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
    data: result.length > 0 ? result : 'Recipe have no comment yet',
  });
});

export const CommentController = {
  makeComment,
  getComment,
  getAllComments,
  updateCommentStatus,
};
