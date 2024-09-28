import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { SemesterRegistraitonStatusEnum } from './semesterRegistration.contants';

// create academic semester
const createRemesterRegistraionToDB = async (payload: TSemesterRegistration) => {
  const academicSemester = payload?.academicSemester;

  // if exist academicSemester
  const isSemesterRegistionExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistionExists) {
    throw new AppError(httpStatus.CONFLICT, 'this semester is already registered');
  }

  // if there any upcoming or ongoing semester
  const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: SemesterRegistraitonStatusEnum.UPCOMING },
      { status: SemesterRegistraitonStatusEnum.ONGOING },
    ],
  });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already have ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }

  // check if semester exist
  const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This academic Semester Not Found');
  }

  // save the data
  const result = await SemesterRegistration.create(payload);
  return result;
};

// get all all semesters
const getAllSemesterRegistraionFromDB = async (query: Record<string, unknown>) => {
  const semestarRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semestarRegistrationQuery.modelQuery;
  const meta = await semestarRegistrationQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single semesters
const getSingleRemesterRegistraionFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

// update semesters
const updateRemesterRegistraionToDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if semester exist
  const isSemesterRegisterExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegisterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Semester Not Found');
  }

  const currentSemesterStatus = isSemesterRegisterExists.status;
  const requestedSemesterStatus = payload?.status;

  // chekc the semester is ended or not
  if (currentSemesterStatus === SemesterRegistraitonStatusEnum.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester registered already ${currentSemesterStatus} `,
    );
  }

  // update flow will be UPCOMING ---> ONGOING ---> ENDED
  // logic for can't change upcoming to ended status
  if (
    currentSemesterStatus === SemesterRegistraitonStatusEnum.UPCOMING &&
    requestedSemesterStatus === SemesterRegistraitonStatusEnum.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You are not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }

  // login for can't change ongoing to upcoming
  if (
    currentSemesterStatus === SemesterRegistraitonStatusEnum.ONGOING &&
    requestedSemesterStatus === SemesterRegistraitonStatusEnum.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You are not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const RemesterRegistraionServices = {
  createRemesterRegistraionToDB,
  getAllSemesterRegistraionFromDB,
  getSingleRemesterRegistraionFromDB,
  updateRemesterRegistraionToDB,
};
