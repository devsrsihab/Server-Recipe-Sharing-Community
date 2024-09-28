import { z } from 'zod';

// Define Zod schemas for subobjects
const UserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20), // Ensure minimum 1 character and maximum 20 characters
  middleName: z.string().max(20), // Allow middleName to be optional and max 20 characters
  lastName: z.string().min(1).max(20), // Ensure minimum 1 character and maximum 20 characters
});

const GuardianValidationSchema = z.object({
  fatherName: z.string().min(1).max(20), // Ensure minimum 1 character and maximum 20 characters
  fatherOccupation: z.string().min(1), // Ensure minimum 1 character
  fatherContactNo: z.string().min(1), // Ensure minimum 1 character
  motherName: z.string().min(1).max(20), // Ensure minimum 1 character and maximum 20 characters
  motherOccupation: z.string().min(1), // Ensure minimum 1 character
  motherContactNo: z.string().min(1), // Ensure minimum 1 character
});

const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1).max(20), // Ensure minimum 1 character and maximum 20 characters
  occupation: z.string().min(1), // Ensure minimum 1 character
  contact: z.string().min(1), // Ensure minimum 1 character
  address: z.string().min(1), // Ensure minimum 1 character
});

// Define Zod schema for the main object
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(8).max(30).optional(),
    student: z.object({
      name: UserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(), // Consider adding validation for date format if needed
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContact: z.string().min(1),
      bloodGroup: z.optional(z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: GuardianValidationSchema,
      localGurdian: z.optional(LocalGuardianValidationSchema),
    }),
  }),
});

// Define Zod schema for the update object
const updateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: UserNameValidationSchema.partial(),
          gender: z.enum(['male', 'female', 'other']).optional(),
          dateOfBirth: z.string().optional(), // Validate date format as YYYY-MM-DD
          admissionSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
          email: z.string().email().optional(),
          contactNo: z.string().min(10).optional(), // Ensure minimum 10 characters for phone number
          emergencyContact: z.string().min(10).optional(), // Ensure minimum 10 characters for phone number
          bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
          presentAddress: z.string().min(1).optional(),
          permanentAddress: z.string().min(1).optional(),
          guardian: GuardianValidationSchema.partial(),
          localGurdian: LocalGuardianValidationSchema.optional(), // Allow localGuardian to be optional
          profileImg: z.string().optional(),
        })
        .partial(), // Make all student fields optional
    })
    .partial(), // Make all body fields optional
});

export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
