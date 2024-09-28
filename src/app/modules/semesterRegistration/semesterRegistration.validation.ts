import { z } from 'zod';
import { SemesterRegistraitonStatus } from './semesterRegistration.contants';

// studentSchema validation
const CreateSemesterRegistrationSchemaValidation = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(SemesterRegistraitonStatus as [string, ...string[]])]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

// update validation
const UpdateSemesterRegistrationSchemaValidation = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z.enum([...(SemesterRegistraitonStatus as [string, ...string[]])]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidation = {
  CreateSemesterRegistrationSchemaValidation,
  UpdateSemesterRegistrationSchemaValidation,
};
