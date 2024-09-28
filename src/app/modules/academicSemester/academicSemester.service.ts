import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.contants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

// create academic semester
const createAcademicSemesterToDB = async (payload: TAcademicSemester) => {
  // check valid code
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid academic semester code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

// get all all semesters
const getAllAcademicSemestersFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single semesters
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

// update semesters
const updateAcademicSemesterToDB = async (id: string, payload: TAcademicSemester) => {
  // check valid code
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid academic semester code');
  }

  const result = await AcademicSemester.findByIdAndUpdate({ _id: id }, payload, { new: true });
  return result;
};

export const AcademicSemeterServices = {
  createAcademicSemesterToDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterToDB,
};
