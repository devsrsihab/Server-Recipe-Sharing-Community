import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.user, USER_ROLE.admin), CommentController.makeComment);
router.get('/', auth(USER_ROLE.admin), CommentController.getAllComments);
router.patch('/:id', auth(USER_ROLE.admin), CommentController.updateCommentStatus);
router.get(
  '/recipe/:recipeId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentController.getComment,
);

export const CommentRoute = router;
