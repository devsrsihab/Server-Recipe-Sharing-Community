import { Router } from 'express';
import { UserRoute } from '../modules/user/user.route';
import { AdminRoute } from '../modules/admin/admin.route';

import { AuthRoute } from '../modules/auth/auth.route';

import { RecipeRoute } from '../modules/recipe/recipe.route';
import { RatingRoute } from '../modules/rating/rating.route';
import { CommentRoute } from '../modules/comment/comment.route';
import { CategoryRoutes } from '../modules/category/category.route';

const router = Router();

// all routes
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/admins',
    route: AdminRoute,
  },

  {
    path: '/auth',
    route: AuthRoute,
  },

  {
    path: '/recipes',
    route: RecipeRoute,
  },
  {
    path: '/ratings',
    route: RatingRoute,
  },
  {
    path: '/comments',
    route: CommentRoute,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
];

// travers the all route
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
