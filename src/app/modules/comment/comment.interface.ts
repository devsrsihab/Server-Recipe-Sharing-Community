import { Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  comment: string;
  status: string;
  isDeleted: boolean;
}
