import fs from 'fs';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, Recipe } from './service';

// mock fs functionality
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// mock path functionality
jest.mock('path', () => ({
  join: jest.fn(() => 'mocked/path/to/recipes.json'),
}));

// mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('recipeService', () => {
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Test Recipe 1',
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Test instructions 1',
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      servings: 4,
      tags: ['tag1', 'tag2'],
    },
    {
      id: '2',
      name: 'Test Recipe 2',
      ingredients: ['ingredient3', 'ingredient4'],
      instructions: 'Test instructions 2',
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      servings: 2,
      tags: ['tag2', 'tag3'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ recipes: mockRecipes }));
  });

  describe('getRecipes', () => {
    it('returns all recipes with default pagination', async () => {
      // act
      const result = await getRecipes();

      // assert
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(fs.readFileSync).toHaveBeenCalledWith('mocked/path/to/recipes.json', 'utf8');
    });

    it('filters recipes by search term', async () => {
      // arrange
      const search = 'Recipe 1';

      // act
      const result = await getRecipes(1, 10, search);

      // assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Test Recipe 1');
    });

    it('filters recipes by tags', async () => {
      // arrange
      const tags = ['tag3'];

      // act
      const result = await getRecipes(1, 10, '', tags);

      // assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Test Recipe 2');
    });

    it('applies pagination correctly', async () => {
      // arrange
      const page = 2;
      const pageSize = 1;

      // act
      const result = await getRecipes(page, pageSize);

      // assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Test Recipe 2');
      expect(result.total).toBe(2);
    });
  });

  describe('createRecipe', () => {
    it('creates a new recipe with a generated ID', () => {
      // arrange
      const newRecipeData = {
        name: 'New Recipe',
        ingredients: ['new ingredient'],
        instructions: 'New instructions',
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        servings: 2,
        tags: ['new tag'],
      };

      // act
      const result = createRecipe(newRecipeData);

      // assert
      expect(result.id).toBe('mock-uuid');
      expect(result.name).toBe('New Recipe');
      expect(fs.writeFileSync).toHaveBeenCalled();

      // check that the recipe was added to the array
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.recipes).toHaveLength(3);
    });
  });

  describe('updateRecipe', () => {
    it('updates an existing recipe', async () => {
      // arrange
      const id = '1';
      const updateData = {
        name: 'Updated Recipe Name',
      };

      // act
      const result = await updateRecipe(id, updateData);

      // assert
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Updated Recipe Name');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('returns null if recipe not found', async () => {
      // arrange
      const id = 'nonexistent';
      const updateData = {
        name: 'Updated Recipe Name',
      };

      // act
      const result = await updateRecipe(id, updateData);

      // assert
      expect(result).toBeNull();
    });
  });

  describe('deleteRecipe', () => {
    it('deletes an existing recipe', async () => {
      // arrange
      const id = '1';

      // act
      const result = await deleteRecipe(id);

      // assert
      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();

      // check that the recipe was removed from the array
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.recipes).toHaveLength(1);
      expect(writtenData.recipes[0].id).toBe('2');
    });

    it('returns false if recipe not found', async () => {
      // arrange
      const id = 'nonexistent';

      // act
      const result = await deleteRecipe(id);

      // assert
      expect(result).toBe(false);
    });
  });
});
