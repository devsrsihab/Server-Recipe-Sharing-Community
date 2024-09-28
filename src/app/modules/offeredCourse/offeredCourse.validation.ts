import { z } from 'zod';
import { Days } from './offeredCourse.contants';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(time);
  },
  {
    message:
      'Invalid Start time format. Please enter a valid time in the format HH:MM (24-hour format).',
  },
);

// create validation
const CreateOfferedCourseSchemaValidation = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicDepartment: z.string(),
      academicFaculty: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      starTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.starTime}`);
        const end = new Date(`1970-01-01T${body.endTime}`);
        return end > start;
      },
      {
        message: 'Start Time Should be before End Time',
      },
    ),
});

// update validation
const UpdateOfferedCourseSchemaValidation = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      starTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.starTime}`);
        const end = new Date(`1970-01-01T${body.endTime}`);
        return end > start;
      },
      {
        message: 'Start Time Should be before End Time',
      },
    ),
});

export const OfferedCourseValidation = {
  CreateOfferedCourseSchemaValidation,
  UpdateOfferedCourseSchemaValidation,
};
