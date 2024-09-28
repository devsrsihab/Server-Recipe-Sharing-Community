import express from 'express';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';
import { RemesterRegistraionControllers } from './semesterRegistration.controller';

const router = express.Router();

// create academic semester
router.post(
  '/create',
  validateRequest(SemesterRegistrationValidation.CreateSemesterRegistrationSchemaValidation),
  RemesterRegistraionControllers.createRemesterRegistraion,
);

// get all
router.get('/', RemesterRegistraionControllers.getAllRemesterRegistraion);

// get single
router.get('/:id', RemesterRegistraionControllers.getSingleRemesterRegistraion);

// update
router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.UpdateSemesterRegistrationSchemaValidation),
  RemesterRegistraionControllers.updateRemesterRegistraion,
);
export const SemesterRegistraitonRoute = router;
