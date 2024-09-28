import { model, Schema } from 'mongoose';
import { TGurdian, TLocalGurdian, TStudent, TUserName, StudentModel } from './student.interface';

// username schema
const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [20, 'First name should not exceed 20 characters'],
    trim: true, // remove extra spaces
  },
  middleName: {
    type: String,
    maxlength: [20, 'Middle name should not exceed 20 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    maxlength: [20, 'Last name should not exceed 20 characters'],
    trim: true,
  },
});

// guardian schema
const GurdianSchema = new Schema<TGurdian>({
  fatherName: {
    type: String,
    required: true,
    maxlength: [20, 'Father name should not exceed 20 characters'],
    trim: true,
  },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
    maxlength: [20, 'Mother name should not exceed 20 characters'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
  motherOccupation: { type: String, required: true },
});

// local guardian schema
const LocalGurdianSchema = new Schema<TLocalGurdian>({
  name: {
    type: String,
    required: true,
    maxlength: [20, 'Name should not exceed 20 characters'],
    trim: true,
  },
  occupation: { type: String, required: true },
  contact: {
    type: String,
    required: true,
  },
  address: { type: String, required: true },
});

// student schema
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: UserNameSchema, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ['male', 'female', 'other'],
        message: "{VALUE} is not valid. Allowed values are 'male', 'female', or 'other'",
      },
    },
    dateOfBirth: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          "{VALUE} is not valid. Allowed values are 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'",
      },
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: GurdianSchema, required: true },
    localGuardian: { type: LocalGurdianSchema },
    profileImg: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//virtual
studentSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + ' ' + this?.name?.middleName + ' ' + this?.name?.lastName;
});

// query middleware show only where isDelete false
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlware for findone
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// aggregate middleware
studentSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

// custom static method
studentSchema.statics.isUserExist = async function (id: string) {
  const existUser = await Student.findOne({ id });
  return existUser;
};

// student model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
