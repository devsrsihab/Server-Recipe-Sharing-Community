import express from 'express';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router();

// create academic semester
router.post(
  '/',
  validateRequest(AcademicFacultyValidation.CreateAcademicFacultySchemaValidation),
  AcademicFacultyControllers.createAcademicFaculty,
);
// get all facultys
router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);
// get single academic faculty
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);
// update facultys
router.patch(
  '/:facultyId',
  validateRequest(AcademicFacultyValidation.UpdateAcademicFacultySchemaValidation),
  AcademicFacultyControllers.updateAcademicFaculty,
);
export const AcademicFacultyRoute = router;
