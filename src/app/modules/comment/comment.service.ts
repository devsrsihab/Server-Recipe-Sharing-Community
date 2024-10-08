import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Comment } from './comment.model';
import { JwtPayload } from 'jsonwebtoken';
import { Recipe } from '../recipe/recipe.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

// create recipe
const makeCommentToDB = async (
  email: JwtPayload,
  payload: { recipeId: string; comment: string },
) => {
  const user = await User.findOne({ email }).select('_id email');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // check recipe is exist
  const recipe = await Recipe.findById(payload.recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Recipe not found');
  }

  // start session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();
    // create a rating transaction 01
    const newComment = await Comment.create(
      [{ user: user?._id, recipe: payload.recipeId, comment: payload.comment }],
      { session },
    ); // transaction return array

    // if created the rating successfully then create the student
    if (!newComment) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create comment');
    }

    const newCommentId = newComment[0]._id;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      { _id: recipe._id },
      { $push: { comments: newCommentId } },
      { session },
    );

    if (!updatedRecipe) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update recipe comments');
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedRecipe;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  } finally {
    await session.endSession();
  }
};

// get all comments
const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find().populate('user'), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery;
  const meta = await commentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// update comment status
const updateCommentStatus = async (id: string, status: string) => {
  const comment = await Comment.findByIdAndUpdate(id, { status }, { new: true });
  return comment;
};

// get all comment by id
const getCommentBasedOnRecipeFromDB = async (recipeId: string, query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find({ recipe: recipeId }).populate('user'), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery;
  const meta = await commentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// delete comment
const deleteCommentFromDB = async (id: string) => {
  const comment = await Comment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return comment;
};

export const RecipeServices = {
  makeCommentToDB,
  getAllCommentsFromDB,
  getCommentBasedOnRecipeFromDB,
  updateCommentStatus,
  deleteCommentFromDB,
};
