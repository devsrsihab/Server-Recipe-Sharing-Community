import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

// get all getFaculty conroller
const getFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await FacultyServices.getAllFacultiesFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculties get successfully',
    meta: result.meta,
    data: result.result,
  });
});

// get single faculty controller
const getSingleFacultie = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultieFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'single faculty get successfully',
    data: result || 'no data found',
  });
});

// update student controller
const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyToDB(facultyId, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty updated successfully',
    data: result || 'no data found',
  });
});

// delete faculty
const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = FacultyServices.deleteFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty deleted successfully',
    data: result,
  });
});

export const FacultyController = {
  getFaculties,
  getSingleFacultie,
  updateFaculty,
  deleteFaculty,
};
