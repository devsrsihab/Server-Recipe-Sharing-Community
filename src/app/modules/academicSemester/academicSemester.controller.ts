import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemeterServices } from './academicSemester.service';

// crate acamdemic semester controller
const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemeterServices.createAcademicSemesterToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

// get all controller
const getAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemeterServices.getAllAcademicSemestersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// find a sinlge academic semester
const getSingleAcademicSemeste = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result = await AcademicSemeterServices.getSingleAcademicSemesterFromDB(semesterId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester get successfully',
    data: result,
  });
});

// update the semesters
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateAbleData = req.body;
  const result = await AcademicSemeterServices.updateAcademicSemesterToDB(id, updateAbleData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester Update successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemester,
  getSingleAcademicSemeste,
  updateAcademicSemester,
};
