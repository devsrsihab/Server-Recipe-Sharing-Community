import { Router } from 'express';
import { UserRoute } from '../modules/user/user.route';
import { StudentRoute } from '../modules/student/student.route';
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicdepartmentRoute } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoute } from '../modules/faculty/faculty.route';
import { CourseRoute } from '../modules/course/course.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { SemesterRegistraitonRoute } from '../modules/semesterRegistration/semesterRegistration.route';
import { OfferedCourseRoute } from '../modules/offeredCourse/offeredCourse.route';
import { AuthRoute } from '../modules/auth/auth.route';
import { EnrolledCourseRoute } from '../modules/enrolledCourse/enrolledCourse.route';
import { RecipeRoute } from '../modules/recipe/recipe.route';

const router = Router();

// all routes
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/students',
    route: StudentRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoute,
  },
  {
    path: '/academic-departments',
    route: AcademicdepartmentRoute,
  },
  {
    path: '/faculties',
    route: FacultyRoute,
  },
  {
    path: '/courses',
    route: CourseRoute,
  },
  {
    path: '/admins',
    route: AdminRoute,
  },
  {
    path: '/semester-registrations',
    route: SemesterRegistraitonRoute,
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoute,
  },
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/enrolled-course',
    route: EnrolledCourseRoute,
  },
  {
    path: '/recipes',
    route: RecipeRoute,
  }
];

// travers the all route
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
