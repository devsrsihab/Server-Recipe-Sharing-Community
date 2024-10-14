// make express middleware for membership checker
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '../modules/user/user.model';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import { Recipe } from '../modules/recipe/recipe.model';

const premiumRecipeChecker = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.user?.email;
    const recipeId = req.params.id;

    // Check if the recipe is premium
    const recipe = await Recipe.findById(recipeId).select('isPaid');

    if (recipe && recipe.isPaid) {
      const user = await User.findOne({ email: userEmail }).select('isPremium membershipEnd _id');

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (!user.isPremium) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not a premium user');
      }

      if (user.membershipEnd && user.membershipEnd < new Date()) {
        await User.updateOne({ _id: user._id }, { isPremium: false });
        throw new AppError(httpStatus.FORBIDDEN, 'Your membership has expired');
      }
    }

    next();
  });
};

export default premiumRecipeChecker;
