import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidation } from './category.validation';
import { USER_ROLE } from '../user/user.constant';
import { CategoryControllers } from './category.controller';

const router = express.Router();

router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', CategoryControllers.getCategoryById);

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.delete('/:id', auth(USER_ROLE.admin), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
