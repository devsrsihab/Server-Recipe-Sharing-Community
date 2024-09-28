import express from 'express';
import { FacultyController } from './faculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.admin, USER_ROLE.faculty), FacultyController.getFaculties);
router.get('/:facultyId', FacultyController.getSingleFacultie);
router.patch('/:facultyId', FacultyController.updateFaculty);
router.delete('/:facultyId', FacultyController.deleteFaculty);

export const FacultyRoute = router;
