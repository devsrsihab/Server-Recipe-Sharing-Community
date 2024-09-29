/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeServices } from './recipe.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create recipe controller
const createRecipe = catchAsync(async (req, res) => {
  const { email } = req.user;
  const payload = req.body;
  const result = await RecipeServices.createRecipe(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe created successfully',
    data: result,
  });
});


// get all recipe conroller
const getAllRecipes = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await RecipeServices.getAllRecipesFromDB(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'recipe get successfully',
    meta: result.meta,
    data: result.result,
  });
});

// get single recipe controller
const getSingleRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RecipeServices.getSingleRecipeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'single recipe get successfully',
    data: result || 'no data found',
  });
});

// update recipe controller
const updateRecipe = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await RecipeServices.updateRecipeToDB(user, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'recipe updated successfully',
    data: result || 'no data found',
  });
});

// upvote recipe controller
const upvoteRecipe = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await RecipeServices.upvoteRecipe(user, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'recipe upvoted successfully',
    data: result,
  });
});

// downvote recipe controller
const downvoteRecipe = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await RecipeServices.downvoteRecipe(user, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'recipe downvoted successfully',
    data: result,
  });
});

// delte single recipe controller
const deleteRecipe = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await RecipeServices.deleteRecipeFromDB(user, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'recipe deleted successfully',
    data: result,
  });
});

export const RecipeController = {
  getAllRecipes,
  createRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  upvoteRecipe,
  downvoteRecipe
};
