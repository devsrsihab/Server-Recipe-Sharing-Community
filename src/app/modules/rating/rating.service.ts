import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Rating } from './rating.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './rating.constant';
import { JwtPayload } from 'jsonwebtoken';
import { Recipe } from '../recipe/recipe.model';
import mongoose from 'mongoose';

// create recipe
const makeRating = async (email: JwtPayload,payload: {recipeId: string, rating: number}) => {

    const user = await User.findOne({ email }).select('_id email');
    
    // console.log('user data ==>', user, 'email ==>', email);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }  

    // check user already rated this recipe
    const isRated = await Rating.findOne({user: user?._id, recipe: payload.recipeId});
    if(isRated){
      throw new AppError(httpStatus.BAD_REQUEST, 'You already rated this recipe');
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
    const newRating = await Rating.create([{user: user?._id, recipe: payload.recipeId, rating: payload.rating}], { session }); // transaction return array

    // if created the rating successfully then create the student
    if (!newRating) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create rating');
    }

    const newRatingId = newRating[0]._id;



    const updatedRecipe = await Recipe.findByIdAndUpdate({_id: recipe._id}, {$push: {ratings: newRatingId}}, { session });

    if (!updatedRecipe) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update recipe ratings');
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





export const RecipeServices = {
  makeRating,
};
