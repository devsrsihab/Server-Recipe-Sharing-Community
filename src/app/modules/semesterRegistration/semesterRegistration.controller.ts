import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RemesterRegistraionServices } from './semesterRegistration.service';

// crate
const createRemesterRegistraion = catchAsync(async (req, res) => {
  const result = await RemesterRegistraionServices.createRemesterRegistraionToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Remester Registraion created successfully',
    data: result,
  });
});

// get all
const getAllRemesterRegistraion = catchAsync(async (req, res) => {
  const result = await RemesterRegistraionServices.getAllSemesterRegistraionFromDB(req.query);
 sendResponse(res, {
   statusCode: httpStatus.OK,
   success: true,
   message: 'Remester Registraion Retrive successfully',
   meta: result.meta,
   data: result.result,
 });
});

// sinlge
const getSingleRemesterRegistraion = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await RemesterRegistraionServices.getSingleRemesterRegistraionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Remester Registraion Single Data get successfully',
    data: result,
  });
});

// update
const updateRemesterRegistraion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateAbleData = req.body;
  const result = await RemesterRegistraionServices.updateRemesterRegistraionToDB(
    id,
    updateAbleData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Remester Registraion Updated successfully',
    data: result,
  });
});

export const RemesterRegistraionControllers = {
  createRemesterRegistraion,
  getAllRemesterRegistraion,
  getSingleRemesterRegistraion,
  updateRemesterRegistraion,
};
