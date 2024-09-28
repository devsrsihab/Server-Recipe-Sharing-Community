import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicSemesterSearchableFields } from '../academicSemester/academicSemester.contants';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

// create academic semester
const createAcademicFacultyToDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

// get all all semesters
const getAllAcademicFacultysFromDB = async (query: Record<string, unknown>) => {
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicFacultyQuery.modelQuery;
  const meta = await academicFacultyQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single semesters
const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

// update semesters
const updateAcademicFacultyToDB = async (id: string, payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.findByIdAndUpdate({ _id: id }, payload, { new: true });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyToDB,
  getAllAcademicFacultysFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyToDB,
};
