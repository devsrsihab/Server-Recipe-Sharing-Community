import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';
import catchAsync from '../../utils/catchAsync';

const createCategory = catchAsync(async (req, res) => {
  const Category = await CategoryServices.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category Created Successfully',
    data: Category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const Category = await CategoryServices.getAllCategories(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category Retrieved Successfully',
    data: Category,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Category = await CategoryServices.getCategoryById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ' Category Retrieved Successfully',
    data: Category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Category = await CategoryServices.updateCategory(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ' Category updated successfully',
    data: Category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Category = await CategoryServices.deleteCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ' Category Deleted Successfully',
    data: Category,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
