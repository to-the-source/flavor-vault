// mock NextResponse
const jsonMock = jest.fn();
jest.mock('next/server', () => ({
  NextResponse: {
    json: jsonMock,
  },
}));

// Mock the recipeService module
jest.mock('../../../features/recipes/service', () => {
  return {
    getRecipes: jest.fn(),
    createRecipe: jest.fn().mockReturnValue({ id: 'mock-id' }),
  };
});

describe('Recipes API Routes', () => {
  let getRecipesMock: jest.Mock;
  let createRecipeMock: jest.Mock;

  // We'll use proper type casting where needed instead of defining a shared type
  let getHandler: (request: unknown) => Promise<unknown>;
  let postHandler: (request: unknown) => Promise<unknown>;

  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();
    jsonMock.mockClear();

    // Reset modules to clear cache
    jest.resetModules();

    // Import the mocked service functions
    const recipeService = await import('@/features/recipes/service');
    getRecipesMock = recipeService.getRecipes as jest.Mock;
    createRecipeMock = recipeService.createRecipe as jest.Mock;

    // Reimport the handlers for each test
    const routeModule = await import('./route');
    getHandler = routeModule.GET as (request: unknown) => Promise<unknown>;
    postHandler = routeModule.POST as (request: unknown) => Promise<unknown>;
  });

  describe('GET /api/recipes', () => {
    it('returns recipes with pagination', async () => {
      // arrange
      const mockRecipes = [
        {
          id: '1',
          name: 'Test Recipe',
          instructions: 'Test instructions',
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
          ingredients: ['ingredient1', 'ingredient2'],
          tags: ['tag1', 'tag2'],
        },
      ];

      getRecipesMock.mockReturnValue({
        data: mockRecipes,
        total: 1,
      });

      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams('page=1&pageSize=10'),
        },
      };

      // act
      await getHandler(mockRequest);

      // assert
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          total: 1,
          data: expect.any(Array),
        })
      );
      expect(getRecipesMock).toHaveBeenCalledWith(1, 10, '', []);
    });

    it('handles search parameters correctly', async () => {
      // arrange
      getRecipesMock.mockReturnValue({
        data: [],
        total: 0,
      });

      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams('search=pasta&tags=italian,quick'),
        },
      };

      // act
      await getHandler(mockRequest);

      // assert
      expect(getRecipesMock).toHaveBeenCalledWith(1, 10, 'pasta', ['italian', 'quick']);
    });

    it('handles errors gracefully', async () => {
      // arrange
      getRecipesMock.mockImplementation(() => {
        throw new Error('Service error');
      });

      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams(),
        },
      };

      // act
      await getHandler(mockRequest);

      // assert
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to fetch recipes' }, { status: 500 });
    });
  });

  describe('POST /api/recipes', () => {
    it('creates a new recipe successfully', async () => {
      // arrange
      const recipeData = {
        name: 'New Recipe',
        instructions: 'Mix all ingredients',
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
        ingredients: ['ingredient1', 'ingredient2'],
        tags: ['tag1', 'tag2'],
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(recipeData),
      };

      // act
      await postHandler(mockRequest);

      // assert
      expect(jsonMock).toHaveBeenCalledWith(
        { message: 'Recipe created successfully', recipeId: 'mock-id' },
        { status: 201 }
      );
      expect(createRecipeMock).toHaveBeenCalledWith({
        name: 'New Recipe',
        instructions: 'Mix all ingredients',
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
        ingredients: ['ingredient1', 'ingredient2'],
        tags: ['tag1', 'tag2'],
      });
    });

    it('validates required fields', async () => {
      // arrange
      const recipeData = {
        // Missing name and instructions
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(recipeData),
      };

      // act
      await postHandler(mockRequest);

      // assert
      expect(jsonMock).toHaveBeenCalledWith(
        { error: 'Name and instructions are required' },
        { status: 400 }
      );
      expect(createRecipeMock).not.toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      // arrange
      const recipeData = {
        name: 'New Recipe',
        instructions: 'Mix all ingredients',
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(recipeData),
      };

      createRecipeMock.mockImplementation(() => {
        throw new Error('Service error');
      });

      // act
      await postHandler(mockRequest);

      // assert
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create recipe' }, { status: 500 });
    });
  });
});
