import React, { useState } from 'react';

interface FormData {
  name: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  instructions: string;
  ingredients: string[];
  tags: string[];
}
interface CreateRecipeFormProps {
  onSubmit: (formData: FormData) => void;
}

const CreateRecipeForm: React.FC<CreateRecipeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    recipeName: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    description: '',
    ingredients: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse and clean the data
    const recipeData = {
      name: formData.recipeName,
      prepTimeMinutes: parseInt(formData.prepTime) || 0,
      cookTimeMinutes: parseInt(formData.cookTime) || 0,
      servings: parseInt(formData.servings) || 1,
      instructions: formData.description,
      ingredients: formData.ingredients
        .split('\n')
        .map(ing => ing.trim())
        .filter(ing => ing !== ''),
      tags: formData.type ? [formData.type] : [],
    };

    // Send data back to parent (createRecipeModal)
    onSubmit(recipeData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    console.log('Form data:', formData);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form 
      id="create-recipe-form" 
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select 
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Category</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="drink">Drink</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Title/Name
        </label>
        <input 
          type="text" 
          name="recipeName"
          value={formData.recipeName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prep Time (minutes):
          </label>
          <input 
            type="number" 
            name="prepTime"
            value={formData.prepTime}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cook Time (minutes):
          </label>
          <input 
            type="number" 
            name="cookTime"
            value={formData.cookTime}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servings:
          </label>
          <input 
            type="number" 
            name="servings"
            value={formData.servings}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description:
        </label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingredients (one per line):
        </label>
        <textarea 
          name="ingredients"
          value={formData.ingredients}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="• Ingredient 1&#10;• Ingredient 2&#10;• Ingredient 3"
          required
        />
      </div>
    </form>
  );
};

export default CreateRecipeForm;