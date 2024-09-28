// 1. Create an interface representing a document in MongoDB.

import { Model, Types } from 'mongoose';

// gurdian
export type TGurdian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

// username
export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

//blood group
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

//local gurdian
export type TLocalGurdian = {
  name: string;
  occupation: string;
  contact: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  email: string;
  contactNo: string;
  emergencyContact: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGurdian;
  localGuardian?: TLocalGurdian;
  profileImg?: string;
  isDeleted: boolean;
};

// for custom static method
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: string): Promise<TStudent | null>;
}

// make type for custom instace isuserExist
// export type StudentMethods =  { isUserExist(id: string): Promise<TStudent | null> }

// export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods>;
