import { Types } from 'mongoose';


// username
export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};


export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  email: string;
  contactNo: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  isDeleted: boolean;
};

