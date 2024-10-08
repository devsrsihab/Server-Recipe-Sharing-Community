import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Recipe } from './recipe.model';
import { IRecipe } from './recipe.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { JwtPayload } from 'jsonwebtoken';

// create recipe
const createRecipe = async (email: string, payload: IRecipe) => {
  // assign current user id to createdBy field
  const user = await User.findOne({ email }).select('_id');
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (!payload.image) {
    payload.image = 'https://placehold.co/600x400/png';
  }

  const result = await Recipe.create({ ...payload, createdBy: user?._id });
  return result;
};

// get all recipes
const getAllRecipesFromDB = async (userData: JwtPayload, query: Record<string, unknown>) => {
  // user ie
  const user = await User.findOne({ email: userData.email }).select('_id');
  const baseModel =
    userData?.role === 'user' ? Recipe.find({ createdBy: user?._id }) : Recipe.find();

  // query builder
  const recipeQuery = new QueryBuilder(baseModel.populate('createdBy').populate('category'), query)
    .search(recipeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();
  return {
    meta,
    result,
  };
};

// get single recipe
const getSingleRecipeFromDB = async (id: string) => {
  const result = await Recipe.findById(id).populate('createdBy').populate('category');
  return result;
};

// update recipe
const updateRecipeToDB = async (userData: JwtPayload, id: string, payload: Partial<IRecipe>) => {
  // if user role is user then delete only his recipe
  const user = await User.findOne({ email: userData.email }).select('_id email');
  const isRecipeOwner = await Recipe.findOne({ _id: id, createdBy: user?._id });

  // if role user but not owner of the recipe
  if (userData?.role === 'user' && !isRecipeOwner) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This is Not Your Recipe, You are not allowed to update this recipe',
    );
  }

  const result = await Recipe.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// upvote recipe
const upvoteRecipe = async (userData: JwtPayload, recipeId: string) => {
  const user = await User.findOne({ email: userData.email }).select('_id email');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Recipe not found');
  }

  // 1. check user already upvoted
  const isUserUpvoted = await Recipe.findOne({ _id: recipeId, upvotedBy: { $in: [user?._id] } });
  if (isUserUpvoted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already upvoted this recipe');
  }

  // 2. if user not upvoted then add user id to upvotedBy array
  const result = await Recipe.findByIdAndUpdate(
    recipeId,
    {
      $push: { upvotedBy: user?._id },
      $pull: { downvotedBy: user?._id },
      $inc: { upvotes: 1, downvotes: recipe.downvotes !== 0 ? -1 : 0 },
    },
    { new: true },
  );

  return result;
};

// downvote recipe
const downvoteRecipe = async (userData: JwtPayload, recipeId: string) => {
  const user = await User.findOne({ email: userData.email }).select('_id email');
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Recipe not found');
  }

  // 1. check user already upvoted
  const isUserDownvoted = await Recipe.findOne({
    _id: recipeId,
    downvotedBy: { $in: [user?._id] },
  });
  if (isUserDownvoted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already downvoted this recipe');
  }

  // 2. if user not downvoted then add user id to downvotedBy array
  const result = await Recipe.findByIdAndUpdate(
    recipeId,
    {
      $push: { downvotedBy: user?._id },
      $pull: { upvotedBy: user?._id },
      $inc: { downvotes: 1, upvotes: recipe.upvotes !== 0 ? -1 : 0 },
    },
    { new: true },
  );

  return result;
};

// delete recipe
const deleteRecipeFromDB = async (userData: JwtPayload, id: string) => {
  // if user role is user then delete only his recipe
  const user = await User.findOne({ email: userData.email }).select('_id emai');
  const isRecipeOwner = await Recipe.findOne({ _id: id, createdBy: user?._id });

  // if role user but not owner of the recipe
  if (userData?.role === 'user' && !isRecipeOwner) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to delete this recipe');
  }

  const baseModel =
    userData?.role === 'user'
      ? Recipe.findByIdAndUpdate(
          { _id: id, createdBy: user?._id },
          { isDeleted: true },
          { new: true },
        )
      : Recipe.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  const result = await baseModel;
  return result;
};

// user recipes
const getUserRecipesFromDB = async (id: string, query: Record<string, unknown>) => {
  const baseQuery = Recipe.find({ createdBy: id }).populate('createdBy').populate('category');

  const recipeQuery = new QueryBuilder(baseQuery, query).filter().sort().paginate().fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get recipe feeds
const getRecipeFeedsFromDB = async (query: Record<string, unknown>) => {
  // ge
  // accending the which is big upvoted
  const baseQuery = Recipe.find().populate('createdBy').populate('category').sort({ upvotes: -1 });
  const recipeQuery = new QueryBuilder(baseQuery, query).filter().sort().paginate().fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const RecipeServices = {
  getAllRecipesFromDB,
  createRecipe,
  getSingleRecipeFromDB,
  updateRecipeToDB,
  deleteRecipeFromDB,
  upvoteRecipe,
  downvoteRecipe,
  getUserRecipesFromDB,
  getRecipeFeedsFromDB,
};
