import { Types } from "mongoose";

export interface IRating {    
  rating: number;  
  recipe: Types.ObjectId;  
  user: Types.ObjectId;  
  isDeleted: boolean;      
}
