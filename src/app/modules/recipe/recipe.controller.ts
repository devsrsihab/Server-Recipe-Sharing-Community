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
// const getSingleStudent = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await StudentServices.getSingleStudentFromDB(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'single recipe get successfully',
//     data: result || 'no data found',
//   });
// });

// update recipe controller
// const updateStudent = catchAsync(async (req, res) => {
//   const { studentId } = req.params;
//   const { recipe } = req.body;
//   const result = await StudentServices.updateStudentToDB(studentId, recipe);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'recipe updated successfully',
//     data: result || 'no data found',
//   });
// });

// delte single recipe controller
// const deleteStudent = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await StudentServices.deleteStudentFromDB(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'recipe deleted successfully',
//     data: result,
//   });
// });

export const RecipeController = {
  getAllRecipes,
  createRecipe
};
