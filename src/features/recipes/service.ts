"use server"

import fs from 'fs';
import path from 'path';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  tags: string[];
}

interface RecipesData {
  recipes: Recipe[];
}

// path to our JSON file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'recipes.json');

// helper to read the data file
const readDataFile = (): RecipesData => {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents) as RecipesData;
  } catch (error) {
    console.error('Error reading recipes data file:', error);
    return { recipes: [] };
  }
};

// helper to write to the data file
const writeDataFile = (data: RecipesData): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to recipes data file:', error);
  }
};

// Server-side function for getting recipes (no HTTP fetch)
export const getRecipesServer = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  tags: string[] = []
): Promise<{ data: Recipe[]; total: number }> => {
  const data = readDataFile();
  let filteredRecipes = [...data.recipes];

  // apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    filteredRecipes = filteredRecipes.filter(
      recipe =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.instructions.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchLower)) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // apply tags filter if provided
  if (tags.length > 0) {
    const tagsLower = tags.map(tag => tag.toLowerCase());
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.tags.some(tag => tagsLower.includes(tag.toLowerCase()))
    );
  }

  // get total count before pagination
  const total = filteredRecipes.length;

  // apply pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRecipes = filteredRecipes.slice(start, end);

  return {
    data: paginatedRecipes,
    total,
  };
};

// Client-side API function (for use in components)
export const getRecipes = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  tags: string[] = []
): Promise<{ data: Recipe[]; total: number }> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  if (search) {
    params.append('search', search);
  }

  if (tags.length > 0) {
    params.append('tags', tags.join(','));
  }

  const response = await fetch(`/api/recipes?${params.toString()}`, {
    cache: 'no-store' // Prevent caching issues during development
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`);
  }

  return await response.json();
};

// get a single recipe by id
export const getRecipeById = async(id: string): Promise<Recipe | null> => {
  const data = await readDataFile();
  const recipe = data.recipes.find(recipe => recipe.id === id);
  return recipe || null;
};

// create a new recipe
export const createRecipe = async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe> => {
  const data = readDataFile();

  // create new recipe with generated id
  const newRecipe: Recipe = {
    id: Math.floor(Math.random() * 90 + 10).toString(),
    ...recipeData,
  };

  // add to recipes array
  data.recipes.push(newRecipe);

  // save to file
  writeDataFile(data);

  return newRecipe;
};

// update an existing recipe
export const updateRecipe = async (
  id: string,
  recipeData: Partial<Omit<Recipe, 'id'>>
): Promise<Recipe | null> => {
  const data = readDataFile();

  // find recipe index
  const index = data.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) return null;

  // update recipe with new data
  const updatedRecipe = {
    ...data.recipes[index],
    ...recipeData,
  };

  // replace in array
  data.recipes[index] = updatedRecipe;

  // save to file
  writeDataFile(data);

  return updatedRecipe;
};

// delete a recipe
export const deleteRecipe = async (id: string): Promise<boolean> => {
  const data = readDataFile();

  // find recipe index
  const index = data.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) return false;

  // remove from array
  data.recipes.splice(index, 1);

  // save to file
  writeDataFile(data);

  return true;
};