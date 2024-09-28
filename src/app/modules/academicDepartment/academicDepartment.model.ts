import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


// pre middlware hook
// academicFacultySchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({ name: this.name });

//   if (isDepartmentExist) {
//     throw new AppError(httpStatus.CONFLICT,'Department Already Exist');
//   }

//   next();
// });

// query middleware
academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartment.findOne(query);
  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND,'Department Not Exist');
  }
  next();
});

// make model
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicFacultySchema,
);
