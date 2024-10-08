/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatAdminId, generateUsername, generatUserId } from './user.utils';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';

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
const getUserProfileFromDB = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');
  }

  const result = await User.findOne({ _id: id });

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
