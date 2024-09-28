import express, { Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();


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



router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserController.createStudent,
);

// faculty create
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

// admin create
router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

// get me
router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getMe,
);

// change status
router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserController.changeStatus,
);

export const UserRoute = router;
