/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IName {
  firstName: string;
  lastName: string;
}

export interface TUser {
  _id?: string;
  id: string;
  name: IName;
  email: string;
  password: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  isPremium: boolean;
  premiumExpiry?: Date;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  status: string;
  role: 'admin' | 'user';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(id: string): Promise<TUser>;
  isPasswordMatch(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
