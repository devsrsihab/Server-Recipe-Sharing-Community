/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generatAdminId,
  generateStuentId,
  generateUsername,
  generatFacultyId,
  generatUserId,
} from './user.utils';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';

// create student
const createStudentToDB = async (file: any, password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if the password empty
  userData.password = password || (config.user_default_password as string);

  // set user role
  userData.role = 'user';
  // create student email
  userData.email = payload.email;

  // academic semester
  const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
  // academic department
  const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

  // start session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();

    userData.id =
      admissionSemester && academicDepartment ? await generateStuentId(admissionSemester) : '';

    const imageName = `${userData.id}${payload.name.firstName}`;
    const path = file?.path;
    const profileImg = await sendImageToCloudinary(imageName, path);
    // create a user transaction 01
    const newUser = await User.create([userData], { session }); // transaction return array
    console.log(newUser);

    // if created the user successfully then create the student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set user id in student id field
    payload.id = newUser[0].id; // embating id
    // set student user field data
    payload.user = newUser[0]._id; // reference id
    payload.profileImg = profileImg?.secure_url; // reference id

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `Failed to create student: ${error?.message}`);
  }
};

// create Admin
const createFacultyToDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if the password empty
  userData.password = password || (config.user_default_password as string);
  // set user role
  userData.role = 'user';
  // create faculty email
  userData.email = payload.email;
  // academic semester
  const academicFaculty = await AcademicFaculty.findById(payload.academicFaculty);
  // academic department
  const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

  // start session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();

    userData.id = academicFaculty && academicDepartment ? await generatFacultyId() : '';

    // create a user transaction 01
    const newUser = await User.create([userData], { session }); // transaction return array

    // if created the user successfully then create the student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set user id in student id field
    payload.id = newUser[0].id; // embating id
    // set student user field data
    payload.user = newUser[0]._id; // reference id

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Facutly');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty');
  }
};

// create Admin
const createAdminToDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if the password empty
  userData.password = password || (config.user_default_password as string);
  // set user role
  userData.role = 'admin';
  // create admin email
  userData.email = payload.email;
  // start session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();

    userData.id = await generatAdminId();

    // create a user transaction 01
    const newUser = await User.create([userData], { session }); // transaction return array
    // if created the user successfully then create the user
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set user id in student id field
    payload.id = newUser[0].id; // embating id

    // set student user field data
    payload.user = newUser[0]._id; // reference id

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: unknown) {
    await session.abortTransaction();
    await session.endSession();
    if (error instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, error.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unknown error occurred');
    }
  }
};

// create user
const createUserToDB = async (payload: TUser) => {
  // if the role admin
  if (payload.role === 'admin') {
    // generate a unique id
    payload.id = (await generatAdminId()) || '';
  } else {
    // generate a unique id
    payload.id = (await generatUserId()) || '';
  }

  // generate username
  payload.username = await generateUsername(payload.name);
  const user = await User.create(payload);
  return user;
};

// admin all user preview
const adminAllUserFromDB = async (email: string, query: Record<string, unknown>) => {
  // query builder
  const allUserQuery = new QueryBuilder(User.find({ email: { $ne: email } }), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await allUserQuery.modelQuery;
  const meta = await allUserQuery.countTotal();
  return {
    meta,
    result,
  };
};

// update user
const adminUpdateUserToDB = async (id: string, payload: TUser) => {
  const { name, ...remainingUserData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingUserData };

  // dynamic loop for name
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, { new: true });
  return result;
};

// admin single preview user
const adminDetailsUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

// delete user to update isDeleted true
const adminDeleteUserToDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

// get user profile
const getUserProfileFromDB = async (email: string, role: string) => {
  let result = null;

  // if user
  if (role === 'user') {
    result = await User.findOne({ email });
  }

  // if admin
  if (role === 'admin') {
    result = await User.findOne({ email });
  }

  return result;
};

// update user data
const updateUserToDB = async (email: string, payload: Partial<TUser>) => {
  const { name, ...remainingUserData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingUserData };

  // dynamic loop for name
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  console.log(payload);

  const result = await User.findOneAndUpdate({ email }, modifiedUpdatedData, { new: true });
  return result;
};

// user follow with following which user follow
const userFollowToDB = async (email: string, payload: { id: string }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the user and the user they want to follow
    const user = await User.findOne({ email }).session(session);
    const followingUser = await User.findById(payload.id).session(session);

    if (!user || !followingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User or target user not found');
    }

    if (user._id.toString() === followingUser._id.toString()) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself');
    }

    if (user.following.includes(followingUser._id.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already followed');
    }

    // Update the following array of the current user
    await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { following: followingUser._id.toString() } },
      { session },
    );

    // Update the followers array of the target user
    await User.findOneAndUpdate(
      { _id: followingUser._id },
      { $addToSet: { followers: user._id.toString() } },
      { session },
    );

    await session.commitTransaction();
    return user;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, `Failed to follow user: ${error.message}`);
  } finally {
    session.endSession();
  }
};

// user unfollow with following array element remove and follwer array element remove
const userUnfollowToDB = async (email: string, payload: { id: string }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the user and the user they want to unfollow
    const user = await User.findOne({ email }).session(session);
    const unfollowingUser = await User.findById(payload.id).session(session);

    if (!user || !unfollowingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User or target user not found');
    }

    if (!user.following.includes(unfollowingUser._id.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not in the list of your followed users');
    }

    if (user._id.toString() === unfollowingUser._id.toString()) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You cannot unfollow yourself');
    }

    // Update the following array of the current user
    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { following: unfollowingUser._id.toString() } },
      { session },
    );

    // Update the followers array of the target user
    await User.findOneAndUpdate(
      { _id: unfollowingUser._id },
      { $pull: { followers: user._id.toString() } },
      { session },
    );

    await session.commitTransaction();
    return unfollowingUser;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, `Failed to unfollow user: ${error.message}`);
  } finally {
    session.endSession();
  }
};

// get user followers
const getUserFollowersFromDB = async (email: string) => {
  const user = await User.findOne({ email }).populate('followers');
  return user?.followers;
};

// get user following
const getUserFollowingFromDB = async (email: string) => {
  const user = await User.findOne({ email }).populate('following');
  return user?.following;
};

// change status
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// change user role
const changeUserRole = async (id: string, payload: { role: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createStudentToDB,
  createFacultyToDB,
  createAdminToDB,
  changeStatus,
  getUserProfileFromDB,
  updateUserToDB,
  userFollowToDB,
  userUnfollowToDB,
  getUserFollowersFromDB,
  getUserFollowingFromDB,
  changeUserRole,
  adminUpdateUserToDB,
  createUserToDB,
  adminDetailsUser,
  adminAllUserFromDB,
  adminDeleteUserToDB,
};
