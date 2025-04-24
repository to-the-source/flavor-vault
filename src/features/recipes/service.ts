import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// get all recipes with optional filtering and pagination
export const getRecipes = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  tags: string[] = []
): Promise<{ data: Recipe[]; total: number }> => {
  // simulate a slow response
  await randomDelay();

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

// get a single recipe by id
export const getRecipeById = (id: string): Recipe | null => {
  const data = readDataFile();
  return data.recipes.find(recipe => recipe.id === id) || null;
};

// create a new recipe
export const createRecipe = async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe> => {
  // simulate a slow response
  await randomDelay();

  const data = readDataFile();

  // create new recipe with generated id
  const newRecipe: Recipe = {
    id: uuidv4(),
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
  // simulate a slow response
  await randomDelay();

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
  // simulate a slow response
  await randomDelay();

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

const randomDelay = async (start = 500, end = 1000) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (end - start) + start));
};
