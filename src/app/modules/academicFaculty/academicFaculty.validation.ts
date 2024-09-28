import { z } from 'zod';

// studentSchema validation
const CreateAcademicFacultySchemaValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be string',
    }),
  }),
});

// update validation
const UpdateAcademicFacultySchemaValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be string',
    }),
  }),
});

export const AcademicFacultyValidation = {
  CreateAcademicFacultySchemaValidation,
  UpdateAcademicFacultySchemaValidation,
};
