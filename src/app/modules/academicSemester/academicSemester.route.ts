import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

// create academic semester
router.post(
  '/',
  validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);
// get all semesters
router.get('/', auth('admin'), AcademicSemesterControllers.getAcademicSemester);
// get single academic semester
router.get('/:semesterId', AcademicSemesterControllers.getSingleAcademicSemeste);
// update semesters
router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema),
  AcademicSemesterControllers.updateAcademicSemester,
);
export const AcademicSemesterRoute = router;
