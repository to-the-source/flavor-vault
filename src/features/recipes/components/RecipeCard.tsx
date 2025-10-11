import { useEffect } from 'react';
import Image from 'next/image';
import { Recipe } from '../types';
import SpinLoader from '@/components/ui/spinner';

interface RecipeCardProps {
  recipe: Recipe;
  image: string;
  isLoading: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, image, isLoading }) => {
  useEffect(() => {
    console.log(`Recipe image status - URL: "${image}", Loading: ${isLoading}`);
  }, [image, isLoading]);

  return (
    <div
      key={recipe.id}
      className="border border-gray-200 rounded-lg overflow-hidden p-5 shadow-md transition-transform duration-200 hover:translate-y-[-5px] hover:shadow-lg"
    >
      {/* Recipe Name */}
      <h3 className="text-lg font-medium mb-2">{recipe.name}</h3>

      {/* Cook Time / Servings */}
      <p className="text-sm text-gray-500 mb-2">
        {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins • {recipe.servings} servings
      </p>

      {/* Image Container */}
      <div className="w-28 h-28 float-right relative">
        {isLoading ? (
          // Custom Spinner when image is loading
          <SpinLoader text="Loading Images..." />
        ) : image ? (
          <Image 
            width={112}
            height={112}
            className="w-full h-full object-cover rounded-lg"
            src={image}
            alt={recipe.name}
            unoptimized
          />
        ) : (
          // Backup when no image and not loading
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-500 text-center px-1">No image</span>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <ul className="list-disc pl-3">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-xs text-gray-700">{ingredient}</li>
        ))}
      </ul>

      {/* Instructions */}
      <p className="text-xs text-gray-500 my-4">
        {recipe.instructions.length > 0 ? recipe.instructions : 'No instructions provided'}
      </p>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};