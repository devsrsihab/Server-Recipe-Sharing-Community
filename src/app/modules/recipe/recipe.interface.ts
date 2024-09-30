import { Types } from "mongoose";

export interface IIngredient {
  name: string;
  quantity: string;
}

export interface IRecipe {
  title: string;
  description: string;
  ingredients: IIngredient[];  
  instructions: string;        
  category: string;            
  prepTime: number;            
  cookTime: number;            
  upvotes: number;             
  downvotes: number;     
  ratings: Types.ObjectId[];  
  comments: Types.ObjectId[];  
  upvotedBy: Types.ObjectId[];  
  downvotedBy: Types.ObjectId[];  
  createdBy: Types.ObjectId;  
  isDeleted: boolean;      
}
