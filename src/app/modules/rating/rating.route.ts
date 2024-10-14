import express from 'express';
import { RatingController } from './rating.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.user, USER_ROLE.admin), RatingController.makeRating);
router.get('/recipe/:recipeId', RatingController.getRating);

export const RatingRoute = router;
