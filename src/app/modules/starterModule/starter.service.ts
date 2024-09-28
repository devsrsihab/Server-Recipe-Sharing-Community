import { TInterface } from './starter.interface';
import { ModelSchema } from './starter.model';

// create 
const createToDB = async (payload: TInterface) => {
  const result = await ModelSchema.create(payload);
  return result;
};

// get all 
const getAllFromDB = async () => {
  const result = await ModelSchema.find();
  return result;
};

// get single 
const getSingleFromDB = async (id: string) => {
  const result = await ModelSchema.findById(id);
  return result;
};

// update 
const updateToDB = async (id: string, payload: TInterface) => {
  const result = await ModelSchema.findByIdAndUpdate({ _id: id }, payload, { new: true });
  return result;
};

export const Services = {
  createToDB,
  getAllFromDB,
  getSingleFromDB,
  updateToDB,
};
