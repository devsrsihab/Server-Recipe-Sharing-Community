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
  const result = await Recipe.create({ ...payload, createdBy: user?._id });
  return result;
};

// get all recipes
const getAllRecipesFromDB = async (userData: JwtPayload, query: Record<string, unknown>) => {

  // user ie
  const user = await User.findOne({email: userData.email}).select('_id');
 const baseModel = userData?.role === 'user' ? Recipe.find({createdBy: user?._id}) : Recipe.find();

  // query builder
  const recipeQuery = new QueryBuilder(baseModel.populate('createdBy'), query)
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
  console.log(id);
  const result = await Recipe.findById(id).populate('createdBy');
  return result;
};

// update recipe
const updateRecipeToDB = async (userData: JwtPayload, id: string, payload: Partial<IRecipe>) => {

    // if user role is user then delete only his recipe
  const user = await User.findOne({email: userData.email}).select('_id, email');
  const isRecipeOwner = await Recipe.findOne({_id: id, createdBy: user?._id});
  
    // if role user but not owner of the recipe
  if(userData?.role === 'user' && !isRecipeOwner){
    throw new AppError(httpStatus.FORBIDDEN, 'This is Not Your Recipe, You are not allowed to update this recipe');
  }


  const result = await Recipe.findByIdAndUpdate( id , payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete recipe
const deleteRecipeFromDB = async (userData: JwtPayload, id: string) => {

  // if user role is user then delete only his recipe
  const user = await User.findOne({email: userData.email}).select('_id, email');
  const isRecipeOwner = await Recipe.findOne({_id: id, createdBy: user?._id});

    // if role user but not owner of the recipe
  if(userData?.role === 'user' && !isRecipeOwner){
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to delete this recipe');
  }


  const baseModel = userData?.role === 'user' ? 
  Recipe.findByIdAndUpdate({_id: id, createdBy: user?._id}, {isDeleted: true}, {new: true}) :
  Recipe.findByIdAndUpdate(id, {isDeleted: true}, {new: true});




  const result = await baseModel;
  return result;
};

export const RecipeServices = {
  getAllRecipesFromDB,
  createRecipe,
  getSingleRecipeFromDB,
  updateRecipeToDB,
  deleteRecipeFromDB
};
