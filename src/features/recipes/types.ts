import { PaginatedResponse } from '@/types/api';

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: string[];
  tags: string[];
}

export type RecipesResponse = PaginatedResponse<Recipe>;
