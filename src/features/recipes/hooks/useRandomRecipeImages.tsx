import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/features/recipes/types'; 

interface UseRandomRecipeImagesReturn {
  randomRecipeImages: Record<string, string>;
  imageLoading: Record<string, boolean>;
}

export const useRandomRecipeImages = (recipes: Recipe[]): UseRandomRecipeImagesReturn => {
  const [randomRecipeImages, setRandomRecipeImages] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const fetchImageForRecipe = useCallback(async (recipeId: string) => {
    // Don't fetch if we already have an image or are loading
    if (randomRecipeImages[recipeId] || imageLoading[recipeId]) {
      return;
    }

    setImageLoading(prev => ({ ...prev, [recipeId]: true }));
    
    try {
      const response = await fetch('https://foodish-api.com/api');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRandomRecipeImages(prev => ({ ...prev, [recipeId]: data.image }));
    } catch (err) {
      console.error(`Error fetching image for recipe ${recipeId}:`, err);
      // Set a default image
      setRandomRecipeImages(prev => ({ ...prev, [recipeId]: '/default-food-image.jpg' }));
    } finally {
      setImageLoading(prev => ({ ...prev, [recipeId]: false }));
    }
  }, [randomRecipeImages, imageLoading]);

  // Fetch images when recipes change
  useEffect(() => {
    if (recipes.length > 0) {
      recipes.forEach(recipe => {
        if (!randomRecipeImages[recipe.id]) {
          fetchImageForRecipe(recipe.id);
        }
      });
    }
  }, [recipes, randomRecipeImages, fetchImageForRecipe]);

  return { randomRecipeImages, imageLoading };
};