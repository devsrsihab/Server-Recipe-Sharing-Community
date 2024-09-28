import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Services } from './starter.service';

// create
const create = catchAsync(async (req, res) => {
  const result = await Services.createToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' created successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req, res) => {
  const result = await Services.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrive successfully',
    data: result,
  });
});

// single
const getSingle = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const result = await Services.getSingleFromDB(facultyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Single Data get successfully',
    data: result,
  });
});

// update
const update = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const updateAbleData = req.body;
  const result = await Services.updateToDB(facultyId, updateAbleData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Updated successfully',
    data: result,
  });
});

export const Controllers = {
  create,
  getAll,
  getSingle,
  update,
};
