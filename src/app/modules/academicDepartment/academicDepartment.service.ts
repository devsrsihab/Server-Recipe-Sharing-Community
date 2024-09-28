import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicSemesterSearchableFields } from '../academicSemester/academicSemester.contants';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

// create academic semester
const createAcademicDepartmentToDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

// get all all semesters
const getAllAcademicDepartmentsFromDB = async (query: Record<string, unknown>) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();

  return {
    result,
    meta,
  };
};

// get single semesters
const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};

// update semesters
const updateAcademicDepartmentToDB = async (id: string, payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.findOneAndUpdate({ _id: id }, payload, { new: true });
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentToDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentToDB,
};
