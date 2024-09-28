import express from 'express';
import { Validation } from './enrolledCourse.validation';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// create
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(Validation.createEnrolledCourseValidationSchema),
  EnrolledCourseControllers.createEnrolledCourse,
);

// update enrolled course
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(Validation.updateEnrolledCourseMarkValidation),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoute = router;
