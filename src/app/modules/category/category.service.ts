import httpStatus from 'http-status';
import { CategorySearchableFields } from './category.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { Category } from './category.model';
import { TCategory } from './category.interface';
import AppError from '../../errors/appError';

const createCategory = async (category: TCategory) => {
  const result = await Category.create(category);
  return result;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const s = new QueryBuilder(Category.find({ isDeleted: false }), query)
    .search(CategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await s.modelQuery;
  return result;
};

const getCategoryById = async (categoryId: string): Promise<TCategory | null> => {
  const isCategoryExists = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, ' Category not found!');
  }

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  }).exec();
  return category;
};

const updateCategory = async (id: string, updateData: Partial<TCategory>) => {
  const isCategoryExists = await Category.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, ' Category not found!');
  }

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return category;
};

const deleteCategory = async (id: string) => {
  const isCategoryExists = await Category.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, ' Category not found!');
  }

  const category = await Category.findByIdAndDelete(id);
  return category;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
