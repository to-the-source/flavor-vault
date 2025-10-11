'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { LuPlus } from "react-icons/lu";
import useDebounce from '@/hooks/useDebounce';
import CreateRecipeModal from '@/components/modals/create-recipe/CreateRecipeModal';
import SpinLoader from '@/components/ui/spinner';

export default function Home() {
  const [tagInput, setTagInput] = useState('');
  const { recipes, loading, error, pagination, filters } = useRecipes();
  const [recipeImages, setRecipeImages] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const [createRecipeModal, setCreateModal] = useState(false);

  const handleOpenModal = () => setCreateModal(true);
  const handleCloseModal = () => setCreateModal(false);

  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const debouncedSearch = useDebounce(filters.search, 300);

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()];
      setCurrentTags(newTags);
      filters.setTags(newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = currentTags.filter(t => t !== tag);
    setCurrentTags(newTags);
    filters.setTags(newTags);
  };

  // Using Random Image from foodish-api
  // Stop Render on every render - ucb
  const fetchRandomImageForRecipe = useCallback(async (recipeId: string) => {
    // Edgecase to stop rendering on every render
    if (recipeImages[recipeId] || imageLoading[recipeId]) {
      return;
    }
    
    setImageLoading(prev => ({ ...prev, [recipeId]: true }));
    
    try {
      const response = await fetch('https://foodish-api.com/api'); // Should go in env file
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecipeImages(prev => ({ ...prev, [recipeId]: data.image }));
    } catch (err) {
      console.error(`Error fetching image for recipe ${recipeId}:`, err);
      // Set Backup image if error
      setRecipeImages(prev => ({ ...prev, [recipeId]: '/default-food-image.jpg' }));
    } finally {
      // Set loading to false, even on error
      setImageLoading(prev => ({ ...prev, [recipeId]: false }));
    }
  }, [recipeImages, imageLoading]); // useCallback dependencies

  // Fetch images only when recipes change (not when recipeImages changes)
  useEffect(() => {
    if (recipes.length > 0) {
      recipes.forEach(recipe => {
        if (!recipeImages[recipe.id]) {
          fetchRandomImageForRecipe(recipe.id);
        }
      });
    }
  }, [recipes, recipeImages, fetchRandomImageForRecipe]); 

  // Debounced search 
  useEffect(() => {
    // Reset if I want new images instead of the one initially loaded
    // setRecipeImages({});
    // setImageLoading({});
  }, [debouncedSearch]);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">FlavorVault</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="justify-self-start text-lg">Discover and explore delicious recipes</div>
          <div className="justify-self-end">
            <button
                className="flex justify-center items-center bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal();
                  }}
              >
                <LuPlus />&nbsp;Create Recipe
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-4">
            <div>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={filters.search}
                onChange={e => filters.setSearch(e.target.value)}
                placeholder="Search recipes..."
              />
            </div>

            <div className="flex w-full">
              <input
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md mr-2"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyPress={e => e.key === 'Enter' && addTag(e)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={addTag}
              >
                Add
              </button>
            </div>
            
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentTags.map(tag => (
                  <div key={tag} className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                    <span className="text-sm mr-1">{tag}</span>
                    <button
                      className="h-5 w-5 min-w-5 p-0 flex items-center justify-center"
                      onClick={() => removeTag(tag)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && <SpinLoader text="Loading Recipes..." />}
        {error && <p className="text-red-500">Error loading recipes: {error.message}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p>No recipes found. Try a different search.</p>
        )}

        {!loading && recipes.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  isLoading={imageLoading[recipe.id] || false} 
                  image={recipeImages[recipe.id] || ''}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p>
                Showing {recipes.length} of {pagination.totalItems} recipes
              </p>

              <div className="flex items-center">
                <button
                  className={`mr-2 px-3 py-1 text-sm rounded-md border ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  disabled={pagination.page === 1}
                  onClick={() => pagination.setPage(pagination.page - 1)}
                >
                  Previous
                </button>

                <span className="mx-2">Page {pagination.page}</span>

                <button
                  className={`ml-2 px-3 py-1 text-sm rounded-md border ${
                    pagination.page * pagination.pageSize >= pagination.totalItems
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  disabled={pagination.page * pagination.pageSize >= pagination.totalItems}
                  onClick={() => pagination.setPage(pagination.page + 1)}
                >
                  Next
                </button>

                <select
                  value={pagination.pageSize}
                  onChange={e => pagination.setPageSize(Number(e.target.value))}
                  className="ml-4 h-8 text-sm rounded-md border border-gray-300 px-2"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateRecipeModal isOpen={createRecipeModal} onClose={handleCloseModal} />
    </div>
  );
}