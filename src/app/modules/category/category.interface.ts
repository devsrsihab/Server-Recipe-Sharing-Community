// Type for the input data when creating/updating a category
export type TCategory = {
  name: string;
  recipeCount?: number;
  isDeleted: boolean;
};
