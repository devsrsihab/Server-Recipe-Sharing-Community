import express, { Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidations } from './user.validation';

const router = express.Router();


// create user
router.post(
  '/create-user',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser,
);

// admin update user
router.put(
  '/admin-update-user/:userId',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.adminUpdateUserValidationSchema),
  UserController.adminUpdateUser,
);


// user profile get 
router.get(
  '/profile',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.userProfile,
);


// user profile update 
router.put(
  '/profile',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserController.updateUser,
);

// user follow
router.post(
  '/follow',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidations.userFollowValidationSchema),
  UserController.userFollow,
);

// user unfollow
router.patch(
  '/unfollow',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidations.userFollowValidationSchema),
  UserController.userUnfollow,
);

// get user followers
router.get(
  '/followers',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getUserFollowers,
);

// get user following 
router.get(
  '/following',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getUserFollowing,
);

// change status
router.patch(
  '/change-status/:userId',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserController.changeStatus,
);

// change user role
router.patch(
  '/change-role/:userId',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.changeUserRoleValidationSchema),
  UserController.changeUserRole,
);

export const UserRoute = router;
