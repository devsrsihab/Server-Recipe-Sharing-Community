import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

// name validation
const nameValidation = z.object({
  firstName: z.string().nonempty({ message: 'First name is required' }),
  lastName: z.string().nonempty({ message: 'Last name is required' }),
});

//user validation
const UserSchemaValidation = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).trim(),
    name: nameValidation,
  }),
});

//create user validation
const createUserValidationSchema = z.object({
  body: z.object({
    name: nameValidation,
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).trim(),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]),
  }),
});

// admin update user validation
const adminUpdateUserValidationSchema = z.object({
  body: z.object({
    name: nameValidation.optional(),
    email: z.string().email({ message: 'Invalid email address' }).trim().optional(),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).optional(),
    profilePicture: z.string().optional(),
  }),
});

// update user validation
const updateUserValidationSchema = z.object({
  body: UserSchemaValidation.partial(),
});

// user follow validation
const userFollowValidationSchema = z.object({
  body: z.object({
    id: z.string().nonempty({ message: 'User ID is required' }),
  }),
});

// change status validation
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string, ...string[]]),
  }),
});

// change user role validation
const changeUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  userFollowValidationSchema,
  updateUserValidationSchema,
  UserSchemaValidation,
  changeStatusValidationSchema,
  changeUserRoleValidationSchema,
  adminUpdateUserValidationSchema,
};
