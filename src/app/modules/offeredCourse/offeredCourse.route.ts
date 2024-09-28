import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// create
router.post('/create',
  validateRequest(OfferedCourseValidation.CreateOfferedCourseSchemaValidation),
  OfferedCourseControllers.createOfferedCourse,
);
// get all
router.get('/', OfferedCourseControllers.getAllOfferedCourse);
// get single
router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);
// update
router.patch('/:id',
  validateRequest(OfferedCourseValidation.UpdateOfferedCourseSchemaValidation),
  OfferedCourseControllers.updateOfferedCourse,
);
router.get(
  '/my-offered-courses/my',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
);

export const OfferedCourseRoute = router;
