import { z } from 'zod';
import { USER_STATUS } from './user.constant';


// name validation
const nameValidation = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
});

//user validation
const UserSchemaValidation = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).trim(),
    name: nameValidation,
  }),
});

// update user validation
const updateUserValidationSchema = z.object({
  body: UserSchemaValidation.partial(),
});

// change status validation
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string , ...string[]]),
  }),
});

export const UserValidations = { updateUserValidationSchema, UserSchemaValidation, changeStatusValidationSchema };
