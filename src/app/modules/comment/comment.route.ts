import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comment.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(CommentValidation.createCommentSchema),
  CommentController.makeComment,
);
router.get('/', auth(USER_ROLE.admin), CommentController.getAllComments);
router.patch('/:id', auth(USER_ROLE.admin), CommentController.updateCommentStatus);
router.get(
  '/recipe/:recipeId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentController.getCommentBasedOnRecipe,
);
router.delete('/:id', auth(USER_ROLE.admin), CommentController.deleteComment);

export const CommentRoute = router;
