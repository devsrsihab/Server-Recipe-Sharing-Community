import express from 'express';
import { RecipeController } from './recipe.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.user, USER_ROLE.admin), RecipeController.createRecipe);

export const RecipeRoute = router;
    