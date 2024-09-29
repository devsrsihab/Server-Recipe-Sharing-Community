import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Recipe } from './recipe.model';
import { IRecipe } from './recipe.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { JwtPayload } from 'jsonwebtoken';

// create recipe
const createRecipe = async (email: string, payload: IRecipe) => {
  // assign current user id to createdBy field
  const user = await User.findOne({ email }).select('_id');
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const result = await Recipe.create({ ...payload, createdBy: user?._id });
  return result;
};

// get all students
const getAllRecipesFromDB = async (userData: JwtPayload, query: Record<string, unknown>) => {

  // user ie
  const user = await User.findOne({email: userData.email}).select('_id');
 const baseModel = userData?.role === 'user' ? Recipe.find({createdBy: user?._id}) : Recipe.find();

  // query builder
  const recipeQuery = new QueryBuilder(baseModel.populate('createdBy'), query)
                      .search(recipeSearchableFields)
                      .filter()
                      .sort()
                      .paginate()
                      .fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();
  return {
    meta,
    result,
  };
};

// get single student
// const getSingleStudentFromDB = async (id: string) => {
//   // const result = await Student.findOne({ id });
//   const result = await Student.findOne({ id })
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     });
//   return result;
// };

// update student
// const updateStudentToDB = async (id: string, payload: Partial<TStudent>) => {
//   const { name, guardian, localGuardian, ...remainingStudentData } = payload;

//   const modifiedUpdatedData: Record<string, unknown> = { ...remainingStudentData };

//   // dynamic loop for name
//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }
//   // dynamic loop for guardian
//   if (guardian && Object.keys(guardian).length) {
//     for (const [key, value] of Object.entries(guardian)) {
//       modifiedUpdatedData[`guardian.${key}`] = value;
//     }
//   }
//   // dynamic loop for localGuardian
//   if (localGuardian && Object.keys(localGuardian).length) {
//     for (const [key, value] of Object.entries(localGuardian)) {
//       modifiedUpdatedData[`localGuardian.${key}`] = value;
//     }
//   }

//   const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };

// get single student
// const deleteStudentFromDB = async (id: string) => {
//   const session = await mongoose.startSession();

//   try {
//     // transaction
//     session.startTransaction();

//     const deletedStudent = await Student.findOneAndUpdate(
//       { id },
//       { isDeleted: true },
//       { new: true, session },
//     );

//     if (!deletedStudent) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Student');
//     }

//     // deleted user
//     const deletedUser = await User.findOneAndUpdate(
//       { id },
//       { isDeleted: true },
//       { new: true, session },
//     );

//     if (!deletedUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
//     }

//     await session.commitTransaction();
//     await session.endSession();
//     return deletedStudent;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Student');
//   }
// };

export const RecipeServices = {
  getAllRecipesFromDB,
  createRecipe
};
