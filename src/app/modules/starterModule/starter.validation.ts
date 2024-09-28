import { z } from 'zod';

// create
const CreateSchemaValidation = z.object({
  body: z.object({}),
});

// update
const UpdateSchemaValidation = z.object({
  body: z.object({}),
});

export const Validation = {
  CreateSchemaValidation,
  UpdateSchemaValidation,
};
