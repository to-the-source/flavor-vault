import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
  <div
    key={recipe.id}
    className="border border-gray-200 rounded-lg overflow-hidden p-5 shadow-md transition-transform duration-200 hover:translate-y-[-5px] hover:shadow-lg"
  >
    <h3 className="text-lg font-medium mb-2">{recipe.name}</h3>

    <p className="text-sm text-gray-500 mb-2">
      {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins • {recipe.servings} servings
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
